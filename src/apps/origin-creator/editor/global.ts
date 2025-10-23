import { loadEditor } from "..";
import { block, unblock } from "../component/backdrop";
import { PROJECT, updateName } from "../projects";
import { MSchema } from "./schema";
import { updatePanels, findSchema, load } from "./load";
import { OMap, set, get, del, has, simplify, keys } from "./wrapper";

import "./api";
import { Editor, update } from "./editor";

// Locates the html element's type and id paths. Returns an array which looks like:
// [["integer", "load_priority"], ["object", "power_file_name"]]
export function traceItem(target: HTMLElement, ver: number): [string, string][] {
    // Locate data path by backtracking through the html tree
    const path: [string, string][] = [];

    // Start by tracing a path to the root
    let t: HTMLElement = target;
    let tid;
    do {
        while (!t?.hasAttribute("jtype")) {
            if (!t?.parentElement) throw Error("traceItem failed, no jtype parent found");
            t = t?.parentElement;
        }

        const type = t?.getAttribute("jtype") as string;
        tid = t?.getAttribute("jid");
        path.push([type, tid ?? ver]);

        if (!t?.parentElement) throw Error("traceItem failed, no parent found");
        t = t?.parentElement;
    } while (tid);
    path[path.length-1][1] = PROJECT.active;

    return path;
}

// Disables all dependent options when the option is false.
function disableDependents(optionValues, optionName) {
    if (!(optionName in JSONED.options.dependents)) return;
    for (const dependent of JSONED.options.dependents[optionName]) {
        if (optionValues[dependent] == null) continue;
        optionValues[dependent] = null;
        if (dependent in JSONED.options.dependents[optionName]) {
            disableDependents(optionValues, dependent);
        }
    }
}
// Enables all dependent options
function enableDependents(optionValues, optionName) {
    if (!(optionName in JSONED.options.dependents)) return;
    for (const dependent of JSONED.options.dependents[optionName]) {
        if (optionValues[dependent] != null) continue;
        optionValues[dependent] = JSONED.options.defaults[dependent];
        if (optionValues[dependent] && dependent in JSONED.options.dependents[optionName]) {
            enableDependents(optionValues, optionName);
        }
    }
}

export function updateOptionHTML(optionValues) {
    document.getElementById("option-toggles")!.innerHTML = Object.keys(JSONED.options.defaults).map(
        k => "<div>" +
            `<input onchange="JSONED.setOptionValue('${k}', this.checked)" id="${k}-toggle" type="checkbox"${optionValues[k] ? " checked" : ""}${optionValues[k] == null ? " disabled" : ""}>` +
            `<label for="${k}-toggle"> ${k}</label>` +
        "</div>"
    ).join("");
}

// Updates all option values, fixing them so 
export function updateOptionValues(): {[key: string]: boolean | null} {
    const optionNames = Object.keys(JSONED.options.defaults).sort();

    let optionValues = JSON.parse(localStorage.getItem("oc-opts") as any);
    if (typeof optionValues != "object" || optionValues == null) optionValues = {};
    
    // Set default values
    for (const optionName of optionNames) {
        if (optionName in optionValues) continue;
        optionValues[optionName] = JSONED.options.defaults[optionName];
    }

    for (const optionName of optionNames) {
        // Any options that are null without dependencies are set back to the default.
        if (optionValues[optionName] == null && (
            !(optionName in JSONED.options.dependencies) ||
            JSONED.options.dependencies[optionName].length == 0
        )) {
            optionValues[optionName] = JSONED.options.defaults[optionName];
        }

        // Any other options without dependents can be left alone.
        if (!(optionName in JSONED.options.dependents)) continue;

        if (optionValues[optionName]) {
            // If the option is on, all dependents and sub-dependents can be enabled
            enableDependents(optionValues, optionName);
        } else {
            // Otherwise, they must be disabled
            disableDependents(optionValues, optionName);
        }
    }
    localStorage.setItem("oc-opts", JSON.stringify(optionValues));
    return optionValues;
}

export const JSONED = {
    LOG_FAILED_TESTS: false as boolean,
    nosave: false as boolean,

    mschemas: {} as {[id: number]: MSchema},
    htmls: {} as {[key: string]: string},
    editors: {} as {[ver: number]: Editor[]},

    options: {
        defaults: {} as {[key: string]: boolean},
        dependencies: {} as {[key: string]: string[]},
        dependents: {} as {[key: string]: string[]}
    },

    getSchema(ver: number): MSchema {
        if (ver < 1) return JSONED.mschemas[1];
        while (!(ver in JSONED.mschemas)) ver--;
        return JSONED.mschemas[ver];
    },

    getCurrentSchema(): MSchema {
        return JSONED.getSchema(get(PROJECT.data.meta, "pack_format") ?? 1);
    },

    setOptionValue(optionName: string, value: boolean) {
        let optionValues = JSON.parse(localStorage.getItem("oc-opts") as any);
        if (typeof optionValues != "object") optionValues = {};
    
        optionValues[optionName] = value;
    
        if (value) {
            // If the option is on, all dependents and sub-dependents can be enabled
            enableDependents(optionValues, optionName);
        } else {
            // Otherwise, they must be disabled
            disableDependents(optionValues, optionName);
        }
    
        localStorage.setItem("oc-opts", JSON.stringify(optionValues));
        updateOptionHTML(optionValues);
    },

    updateName: updateName,
    updateNamespace(target: HTMLInputElement) {
        if (!target.value.trim()) target.value = "my_pack";
    },

    refresh() {
        loadEditor(PROJECT.path);
    },

    findData(target: HTMLElement, ver: number): [any, string] {
        const path = traceItem(target, ver);

        // Go through that path to find the data we need
        let d = PROJECT.parent;

        for (let i = path.length - 1; i >= 1; i--) {
            const [type, k] = path[i];
            if (type == "or") {
                // Or types simply pass on their index to the next guy, so long as this "or" is not the last item in the path.
                path[i-1][1] = k;
                continue;
            } else if (type == "more") {
                // More types are simply ignored
                continue;
            }

            if (!Array.isArray(d) && !has(d, k)) {
                // We are trying to find a value that doesn't exist yet, so we need to make it
                switch (type) {
                    case "list":
                    case "tuple":
                        set(d, k, []);
                        update();
                        break;
                    case "object":
                        set(d, k, {});
                        update();
                        break;
                }
            }

            d = get(d, k);
        }

        return [d, path[0][1]];
    },
    setData(target: HTMLElement, val: any, y: any = false) {
        const [d, k] = JSONED.findData(target, PROJECT.ver);

        let tval = val;
        if (target.tagName == "SELECT") {
            const i = val.indexOf("-");
            const type = val.substring(0, i);
            const v = val.substring(i+1);

            switch (type) {
                case "number": tval = parseFloat(v); break;
                case "string": tval = v; break;
                case "boolean": tval = v === "true"; break;
                case "object": tval = v === "null" ? null : undefined; break;
                case "undefined": tval = undefined; break;
                default: throw Error(`Tried to set invalid value of enum "${val}"`);
            }
        } else {
            // Because empty strings are barely ever useful to us, if a field is empty we actually delete it instead of storing it
            if (tval === "" || y === false && tval === false) tval = undefined;
        }

        if (Array.isArray(d) && tval === undefined) tval = "";
        set(d, k, tval);

        if (target.tagName == "SELECT") {
            if (y !== false) {
                // If y is defined, then this is an enum with "more" fields
                const sparent = target?.parentElement?.parentElement?.parentElement;
                const jmore = target?.parentElement?.nextElementSibling;
                if (!sparent) throw Error("no great grandfather of select element");
                if (!jmore) throw Error("no jmore uncle of select element");

                jmore.innerHTML = JSONED.htmls[`more-${y}-${val}`];

                // Load parent object (to delete now unused fields)
                const [ip, ik] = JSONED.findData(sparent, PROJECT.ver); // TODO: some simpler way of putting this in place

                // Do the load
                load(PROJECT.ver, ip, ik, sparent, undefined, true); // Rekeying is always necessary since fields changed
                updatePanels();
            }
        }

        update();
    },
    toggleObject(target: HTMLElement) {
        const [d, k] = JSONED.findData(target, PROJECT.ver);
        const parent = target.parentElement!;

        const hkey = target.getAttribute("hkey");
        const lkey = target.getAttribute("key");
        if (!hkey || !lkey) throw Error("cannot toggle object without hkey and key attribute");

        if (has(d, k)) {
            // The object is on, so turn it off

            // remove the object from it's parent
            del(d, k);
            // Reset inner html
            parent.innerHTML = JSONED.htmls[hkey];
        } else {
            // The object is off, so turn it on

            // Add new data
            if (target.getAttribute("type") == "list") {
                // Set list object as it is not set currently
                set(d, k, []);
            } else {
                set(d, k, {});
            }
            // Reset inner html
            parent.innerHTML = JSONED.htmls[lkey];

            load(PROJECT.ver, d, k, parent.parentElement!); // Loads only what is necessary
            updatePanels();
        }

        update();
    },
    addListItem(target: HTMLElement, type: string, named: boolean = false, noload: boolean = false) {
        // Find list
        const [d, k] = JSONED.findData(target, PROJECT.ver);
        const v = get(d, k);
        const x = type == "object" ? {} : type == "list" ? [] : "";

        // Generate list key
        let key: string = String(target.parentElement?.querySelectorAll(":scope > [jtype]")?.length ?? 0);
        if (named) {
            // Named lists use strings rather than numbers
            const illegal = new Set(JSON.parse(target.parentElement?.getAttribute("i") || "[]"));

            // Regenerate keys until we find one that is not already in the data and is not illegal
            key = "key" + key;
            while (illegal.has(key) || has(v, key)) key += "_";
        }

        const htmlid = target.getAttribute("key");
        if (!htmlid) throw Error("cannot add list item to element without key attribute");

        target.insertAdjacentHTML("beforebegin",
            `<div class="panel"${named ? " named" : ""} jtype="${escape(type)}" jid=${key}>${JSONED.htmls[htmlid]}</div>`
        );

        set(v, key, x);
        if (!noload) {
            const child = target.parentElement!.querySelector(`:scope > [jid="${key}"]`) as HTMLElement;
            if (!child) throw Error("cannot find add list item child");
            load(PROJECT.ver, v, key, child); // Loads only what is necessary
        }
        updatePanels();
        update();
    },
    delListItem(target: HTMLElement, named: boolean = false) {
        const [list, ji] = JSONED.findData(target, PROJECT.ver);

        // Remove target element
        const parent = target.parentElement!;
        target.remove();

        if (named) {
            // Simply remove out of data (also removing key)
            del(list, ji, true);
        } else {
            const jid = parseInt(ji);

            // Shift ids of existing elements
            const items = parent.querySelectorAll(":scope > [jtype]");
            for (let i = jid; i < items.length; i++) {
                items[i].setAttribute("jid", String(i));
            }

            // splice item out of data
            list.splice(jid, 1);
        }

        update();
    },
    moveListItem(target: HTMLElement, up: boolean = false, named: boolean = false) {
        const [list, ji] = JSONED.findData(target, PROJECT.ver);

        if (named) {
            // This is all pointless if this is not an OMap.
            if (list instanceof OMap) {
                const all = target.parentElement!.querySelectorAll(":scope > [jtype]");
                const i: number = Array.prototype.indexOf.call(all, target);
                const key = target.getAttribute("jid");
                if (!key) throw Error("cannot move list item without jid attribute");

                if (up) {
                    if (i > 0) {
                        // Move data up
                        list.shift(key, -1, true);
                        update();
                        // Move html up
                        target.parentElement!.insertBefore(target, target.previousElementSibling);
                    }
                } else {
                    if (i < all.length-1) {
                        // Move data down
                        list.shift(key, 1, true);
                        update();
                        // Move html down (if null it gets inserted at the end! That's so cool :D)
                        target.parentElement!.insertBefore(target, target.nextElementSibling?.nextElementSibling!);
                    }
                }
            }
        } else {
            const i = parseInt(ji);
            if (up) {
                if (i > 0) {
                    // Move data up
                    [list[i-1], list[i]] = [list[i], list[i-1]];
                    update();
                    // Move html up
                    target.previousElementSibling!.setAttribute("jid", ji);
                    target.setAttribute("jid", String(i-1));
                    target.parentElement!.insertBefore(target, target.previousElementSibling);
                }
            } else {
                if (i < list.length-1) {
                    // Move data down
                    [list[i], list[i+1]] = [list[i+1], list[i]];
                    update();
                    // Move html down
                    target.nextElementSibling!.setAttribute("jid", ji);
                    target.setAttribute("jid", String(i+1));
                    target.parentElement!.insertBefore(target, target.nextElementSibling!.nextElementSibling);
                }
            }
        }
    },
    cloneListItem(target: HTMLElement, named: boolean = false) {
        const [list, ji] = JSONED.findData(target, PROJECT.ver);
        let key;
        let elem;

        if (named) {
            const omap = list as OMap;

            // Find new key
            const illegal = new Set(JSON.parse(target.parentElement!.getAttribute("i") || "[]"));

            // Regenerate keys until we find one that is not already in the data and is not illegal
            key = ji + "_";
            while (illegal.has(key) || has(omap, key)) key += "_";

            // Copy value in omap
            const n = omap.index(ji, true);
            omap.k.splice(n+1, 0, key);
            omap.v[key] = JSON.parse(JSON.stringify(omap.v[ji]));

            // Clone html
            elem = target.cloneNode(true) as HTMLElement;
            elem.classList.remove("panel-sel");
            target.insertAdjacentElement("afterend", elem);
            (elem.firstElementChild.lastElementChild as HTMLInputElement).value = key;
            elem.setAttribute("jid", key);
        } else {
            const n = parseInt(ji);
            key = n+1;
            // Copy value in list
            list.splice(n, 0, JSON.parse(JSON.stringify(list[ji])));

            // Clone html
            elem = target.cloneNode(true) as HTMLElement;
            elem.classList.remove("panel-sel");
            target.insertAdjacentElement("afterend", elem);
            // Increment all indices
            let i = 0;
            const jids = target.parentElement?.querySelectorAll(":scope > [jid]") || [];
            for (const e of jids) {
                e.setAttribute("jid", i++ as any);
            }
        }

        update();

        // These... shouldn't be necessary, but they are for some reason
        load(PROJECT.ver, list, key, elem);
        updatePanels();
    },
    clearListItems(target: HTMLElement, named: boolean = false) {
        const [d, k] = JSONED.findData(target, PROJECT.ver);

        // Remove all data
        if (named) {
            const v = get(d, k);

            // Named lists... require deleting specific keys one at a time.
            for (const item of target.querySelectorAll(":scope > [jtype]").values()) {
                // Remove data
                del(v, item.getAttribute("jid"), true);
                update();
                // Remove html
                item.remove();
            }
        } else {
            // Normal lists are easy
            set(d, k, []);
            update();

            // Remove all html
            for (const item of target.querySelectorAll(":scope > [jtype]").values()) {
                item.remove();
            }
        }
    },
    changeListKey(target: HTMLElement, value: string) {
        // Find list
        const [d, k] = JSONED.findData(target.parentElement!, PROJECT.ver);
        const v = get(d, k);
        const illegal = new Set(JSON.parse(target.parentElement!.getAttribute("i") || "[]"));

        // Get old key
        const key = target.getAttribute("jid");
        if (!key) throw Error("cannot change list key on element without jid attribute");
        if (key == value) return;

        // Get new key
        let nkey = value.trim() || "_";
        while (illegal.has(nkey) || has(v, nkey)) nkey += "_";
        (target?.firstElementChild?.firstElementChild as any).value = nkey;

        // Update data
        if (v instanceof OMap) {
            v.rename(key, nkey);
        } else {
            const p = v[key];
            delete v[key];
            v[nkey] = p;
        }
        update();

        // Update html
        target.setAttribute("jid", nkey);
    },
    toggleOr(target: HTMLElement, ver?: number, {defload, force, save}: {defload?: string, force?: boolean, save?: boolean} = {}) {
        const [d, k] = JSONED.findData(target, ver ?? PROJECT.ver);
        const parent = target.parentElement!;

        const defload_c = defload ?? "0";

        const hkey = target.getAttribute("hkey");
        const lkey = target.getAttribute("key");
        if (!hkey || !lkey) throw Error("cannot toggle or without hkey and key attribute");


        if (force ?? has(d, k)) {
            // The object is on, so turn it off

            // remove the object from it's parent
            del(d, k);
            // Reset inner html
            parent.innerHTML = JSONED.htmls[hkey];
        } else {
            // The object is off, so turn it on

            // Reset inner html
            parent.innerHTML = JSONED.htmls[lkey];

            const select = parent.querySelector("select");
            if (!select) throw Error("cannot toggleOr element without select");
            JSONED.switchData(select, defload_c, ver ?? PROJECT.ver, {save: save});
            if (save ?? true) updatePanels();
        }

        update(save ?? true);
    },
    switchData(target: HTMLElement, value: string, ver?: number, {noload, save}: {noload?: boolean, save?: boolean} = {}) {
        // Just in case, set target value
        if (target) (target as any).value = value;

        // Delete any lingering html
        const e = target?.parentElement?.parentElement?.querySelector(":scope > [jtype]");
        if (e) e.remove();

        // Locate data and handle undefined
        const [d, k] = JSONED.findData(target, ver ?? PROJECT.ver);

        if (value === "-1") { // undefined
            del(d, k);
            update(save ?? true);
        } else {
            // If this select element needs to preserve multiple <-> single data, let it do so before anything else
            if (target.hasAttribute("preserver")) {
                const ignored = ["name", "description", "badges", "hidden", "type", "loading_priority"];
                const src = get(d, k);
                let preserved = keys(src).filter(v => !ignored.includes(v));
                if (preserved.length > 0) {
                    if (value == "1") {
                        if (get(src, "type") != "origins:multiple") {
                            // Swapping to multiple
                            const out = {};
                            for (const key of preserved) {
                                out[key] = get(src, key);
                                del(src, key);
                            }
                            out["type"] = get(src, "type");
                            set(src, "key0", out);
                        }
                    } else {
                        if (get(src, "type") == "origins:multiple") {
                            // Swapping to either simple or custom, from multiple.
                            const out = get(src, preserved[0]);
                            for (const key of preserved) {
                                del(src, key);
                            }
                            for (const key of keys(out)) {
                                set(src, key, get(out, key));
                            }
                        }
                    }
                }
            }

            // Get option data
            const option = target.querySelector(`option[value="${value}"]`);
            if (!option) throw Error("cannot switchData on element without option element");

            const type = option.getAttribute("type");
            const key = option.getAttribute("key");
            // const desc = option.getAttribute("desc");
            // const href = option.getAttribute("href");

            let rekey = false;
            const v = get(d, k);
            if (type == "object") {
                if (typeof v != "object" || Array.isArray(v)) set(d, k, {});
                else if (v instanceof OMap) rekey = true;
            } else if (type == "list") {
                if (!Array.isArray(v)) set(d, k, []);
            } else if (typeof v == "object") {
                set(d, k, "");
            }

            // TODO: desc and href? Maybe.
            if (!key) throw Error("cannot switchData on option without key");
            target.parentElement!.insertAdjacentHTML("afterend", JSONED.htmls[key]);

            // When switching types, sometimes keys transfer over, so we just let the load function handle it
            if (!noload) {
                const s = findSchema(target, ver ?? PROJECT.ver); // We do, however, give the load function the correct schema
                if (s.type !== "or") throw Error("'or' found a schema that isn't from itself");
                const i = Array.prototype.indexOf.call(option.parentElement!.children, option);

                load(ver ?? PROJECT.ver, d, k, target.parentElement!.nextElementSibling as HTMLElement, s.or[i], rekey);
                update(save ?? true);
            }

            if (save ?? true) updatePanels();
        }
    },

    setImage(img: HTMLImageElement, ipt: HTMLInputElement, width: number, height: number) {
        const [d, k] = JSONED.findData(img, PROJECT.ver);
        if (ipt.files && ipt.files.length > 0) {
            block();
            const reader = new FileReader();
            reader.onload = (e) => {
                const image = new Image();
                image.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(image, 0, 0, width, height);
                    const src = canvas.toDataURL("image/jpeg", 1);
                    img.src = src;

                    set(d, k, src);
                    update();

                    unblock();
                };
                image.src = e?.target?.result as any;
            };
            reader.readAsDataURL(ipt.files.item(0)!);
        }
    },
    clearImage(img: HTMLImageElement, ipt: HTMLInputElement) {
        img.removeAttribute("src");
        ipt.value = "";

        const [d, k] = JSONED.findData(img, PROJECT.ver);
        del(d, k);
        update();
    },
    fixTypeFromCondition(typeElem: HTMLSelectElement, enabled: boolean) {
        if (!typeElem) return;

        if (enabled) {
            if (typeElem.value == "string-origins:attribute" || typeElem.value == "string-origins:restrict_armor") {
                typeElem.value = "string-origins:conditioned_" + typeElem.value.substring(typeElem.value.indexOf(":")+1);
                typeElem.dispatchEvent(new Event("change"));
            }
        } else {
            if (typeElem.value == "string-origins:conditioned_attribute" || typeElem.value == "string-origins:conditioned_restrict_armor") {
                typeElem.value = "string-origins:" + typeElem.value.substring(typeElem.value.indexOf("_")+1);
                typeElem.dispatchEvent(new Event("change"));
            }
        }
    },
    fixConditionFromType(typeElem: HTMLSelectElement) {
        if (!typeElem) return;

        if (typeElem.value == "string-origins:attribute" || typeElem.value == "string-origins:restrict_armor") {
            const orElem: HTMLButtonElement = typeElem.parentElement?.previousElementSibling?.previousElementSibling?.lastElementChild?.firstElementChild as HTMLButtonElement;
            if (!orElem) return;


            if (orElem?.firstElementChild?.classList?.contains("bi-dash")) {
                orElem.dispatchEvent(new Event("click"));
            }
        } else if (typeElem.value == "string-origins:conditioned_attribute" || typeElem.value == "string-origins:conditioned_restrict_armor") {
            const orElem: HTMLButtonElement = typeElem.parentElement?.previousElementSibling?.previousElementSibling?.lastElementChild?.firstElementChild as HTMLButtonElement;
            if (!orElem) return;

            if (orElem?.firstElementChild?.classList?.contains("bi-plus")) {
                orElem.dispatchEvent(new Event("click"));
            }
        }
    },
    changeToMultiple(typeElem: HTMLSelectElement) {
        const pt = typeElem?.parentElement?.parentElement?.parentElement?.parentElement?.firstElementChild?.firstElementChild;
        if (!pt || !(pt instanceof HTMLSelectElement)) throw Error("cannot change type to multiple, did not find type selector");
        pt.value = '1';
        pt.dispatchEvent(new Event("change"));
    }
};
(window as any).JSONED = JSONED;