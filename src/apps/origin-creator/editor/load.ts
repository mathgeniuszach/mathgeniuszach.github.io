import { escape } from "lodash";

import { PROJECT } from "../projects";
import { regescape, resolve } from "./build";
import { ISchema } from "./schema";
import { JSONED, traceItem } from "./global";
import { get, set, OMap, del, keys, has } from "./wrapper";
import { $$ } from "..";

export function updatePanels() {
    // Darken panels
    $$("section .panel").forEach(el => {
        const close = el?.parentElement?.closest(".panel, .panel-dark");
        if (close && close.classList.contains("panel")) {
            el.classList.remove("panel");
            el.classList.add("panel-dark");
        }
    });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.font = '400 16px Arial, Helvetica, sans-serif, bootstrap-icons';

    // Update column widths
    $$("[jtype=object]").forEach(el => {
        // eslint-disable-next-line no-undef
        const labels = [...el.querySelectorAll(".field > span:first-child")]
            .filter(label => label?.parentElement?.parentElement?.closest("[jtype=object]") == el) as HTMLElement[];

        // Calculate minimum size
        let minWidth = 100;
        for (const label of labels) {
            const width = context.measureText(label.textContent || "").width + 2;
            if (width > minWidth) minWidth = width;
        }

        // Set size of all labels to minimum size
        for (const label of labels) {
            label.style.width = String(minWidth) + "px";
            label.style.minWidth = String(minWidth) + "px";
        }
    });

    canvas.remove();
}


export function findSchema(elem: HTMLElement, ver: number): ISchema {
    const path = traceItem(elem, ver);

    let s = JSONED.mschemas[ver].links[PROJECT.type];
    // console.log(s, PROJECT.type);

    for (let i = path.length - 1; i > 0; i--) {
        s = resolve(s, ver);

        const k = path[i-1][1];
        const type = path[i][0];

        if (k.includes(" ")) {
            if (s.type != "object" || !s.props) throw Error("Schema doesn't match html");
            const parts = k.split(" ");
            s = (s.props[parts[0]] as any).more[parts[1]];
            continue;
        }

        switch (type) {
            case "or":
                if (s.type == "or") s = s.or[k];
                else throw Error("Schema doesn't match html");
                break;
            case "list":
                if (s.type == "list") s = s.vals;
                else throw Error("Schema doesn't match html");
                break;
            case "tuple":
                if (s.type == "tuple") s = s.vals[k];
                else throw Error("Schema doesn't match html");
                break;
            case "object":
                if (s.type == "object") {
                    if (s.props && s.props[k]) s = s.props[k];
                    else if (s.extra) s = s.extra;
                    else throw Error("Schema doesn't match html");
                } else {
                    throw Error("Schema doesn't match html");
                }
                break;
            case "more":
                s = s[k];
                break;
        }
    }

    s = resolve(s, ver);
    return s;
}

export function isValid(ver: number, ssor: ISchema, v: any): boolean {
    // TODO: more extensive evaluation
    const t = typeof v;

    let sor = resolve(ssor, ver);

    if (sor.type === "const") return v === sor.const;
    if (sor.type === "enum") {
        if (v && t === "object") return false;
        if (t === "string") {
            if (v[0] == "$") return false;
            const x = v.includes(":") ? v.replace("apoli:", "origins:") : sor.ns ? sor.ns + ":" + v : v;
            return sor.enum.includes(v) || sor.enum.includes(x) || (sor.convert && x in sor.convert);
        }
        return sor.enum.includes(v);
    }
    if (sor.type === "or") {
        for (const isor of sor.or) {
            if (isValid(ver, isor, v)) return true;
        }
        return false;
    }
    if (t === "object") {
        // If the type is an object we must go deeper
        if (Array.isArray(v)) {
            // Lists and tuples are simple enough
            if (sor.type == "list") {
                for (const val of v) if (!isValid(ver, sor.vals, val)) return false;
                return true;
            }
            if (sor.type == "tuple") {
                for (let i = 0; i < sor.vals.length; i++) if (!isValid(ver, sor.vals[i], v[i])) return false;
                return true;
            }
            return false;
        } else if (sor.type == "object") {
            const more = {};
            // Get all more fields and schemas from set values
            // NOTE: currently only works one level deep
            if (sor.props) {
                for (const kk of keys(v)) {
                    // Transform key with alias if necessary
                    const k = kk in sor.talias ? sor.talias[kk] : kk;

                    const s = sor.props[k];
                    if (s?.type == "enum" && s.more) {
                        // Only check enum types that have a more field
                        // Get the value and use it to find a schema
                        let nv = get(v, kk);

                        const idvo = `${typeof nv}-${nv}`;
                        if (typeof nv == "string") {
                            nv = nv.includes(":") ? nv.replace("apoli:", "origins:") : s.ns ? s.ns + ":" + nv : nv;
                        }
                        const idv = `${typeof nv}-${nv}`;

                        // Get the more schema referenced by the set value
                        const tidv = idv in s.more ? idv : idvo in s.more ? idvo : null;
                        if (tidv == null) return false; // If no more schema can be found, this is an invalid value

                        Object.assign(more, s.more[tidv]);

                        // Also set any aliases
                        if (s.talias && tidv in s.talias) {
                            for (const [oldk, newk] of Object.entries(s.talias[tidv])) {
                                more[oldk] = more[newk as any];
                            }
                        }
                    }
                }
            }

            // Check all current keys
            for (const kk of keys(v)) {
                let nv = get(v, kk);

                // Transform key with alias if necessary
                const k = (sor.talias && kk in sor.talias) ? sor.talias[kk] : kk;

                // If none of the conditions are met for the given key, this object is not valid
                if (!(
                    // If key is in props and it is undefined or has the right type
                    sor.props && k in sor.props && isValid(ver, sor.props[k], nv) ||
                    // If key validates with extra
                    sor.extra && isValid(ver, sor.extra, nv) ||
                    // If key (or alias) is a more field
                    kk in more && isValid(ver, more[k], nv)
                )) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    return t === sor.type || t == "number" && sor.type == "integer";
}

export function load(ver: number, p: any, k: string | number, elem: HTMLElement, schema?: ISchema, r: boolean = false): any {
    if (!elem) {
        console.log(ver, p, k, schema);
        throw Error(`Attempt to load non-existant element.`);
    }

    let e = elem;
    while (!e.hasAttribute("jtype")) {
        if (!e.parentElement) throw Error("jtype element is missing parent");
        e = e.parentElement;
    }

    // If the item is a named object, just update it's key value
    if (elem.hasAttribute("named")) {
        (elem?.firstElementChild?.firstElementChild as HTMLInputElement).value = String(k);
        elem.setAttribute("jid", String(k));
    }

    // Find this element's schema
    let s: ISchema = schema as any;
    if (schema == undefined) s = findSchema(e, ver);
    s = resolve(s, ver);

    // Get the item's current value
    let v = get(p, k);

    // Do the loading
    switch (s.type) {
        // Const actually loads data into p, rather than loading p into const.
        case "const": set(p, k, s.const); break;

        case "or": {
            let chooser: HTMLElement | null = elem.querySelector(":scope > div > button[key]");
            let unspec = !!chooser;
            if (!chooser) chooser = elem.querySelector("select");
            if (!chooser) throw Error("or element is missing chooser");

            if (v !== undefined) {
                // If v exists, determine if it's valid according to the schema
                for (let i = 0; i < s.or.length; i++) {
                    if (isValid(ver, s.or[i], v)) {
                        if (unspec) {
                            JSONED.toggleOr(chooser, ver, {defload: String(i), force: false, save: false});
                        } else {
                            JSONED.switchData(chooser, String(i), ver, {save: false});
                        }
                        return;
                    }
                }
            }

            // Nothing to validate or validation failed, so we default to the unspecified, default, or first option
            if (unspec) {
                JSONED.toggleOr(chooser, ver, {defload: "-1", force: true, save: false});
            } else {
                JSONED.switchData(chooser, String(s.default ?? 0), ver, {save: false});
            }
            break;
        }
        case "object": {
            // If this object is shown and not loaded, it does need to be loaded
            if (typeof v != "object" && s.show) v = {};

            const btn = elem.querySelector(":scope > div > button");
            const hidden = !!elem.querySelector(":scope > div > button > p.bi-plus");

            if (typeof v == "object" && !Array.isArray(v)) {
                // Load the object if it is unloaded
                if (!s.show && btn && btn.parentElement && hidden) {
                    const lkey = btn.getAttribute("key");
                    if (!lkey) throw Error("object button is missing hkey");
                    btn.parentElement.innerHTML = JSONED.htmls[lkey];
                }

                let rekey = r;

                // Any non-OMap is converted into one when "object" is involved (This keeps keys in order)
                if (!(v instanceof OMap)) {
                    v = new OMap(v);
                    rekey = true;
                    set(p, k, v);
                }

                let nkeys: string[] = [];
                let leftover: string[] = [];

                // First, transform aliases.
                if (s.talias) {
                    for (const [oldk, newk] of Object.entries(s.talias)) {
                        if (has(v, oldk)) {
                            set(v, newk, get(v, oldk));
                            del(v, oldk, true);
                        }
                    }
                }

                if (s.props) {
                    const ok = new Set<string>();

                    // Then we load starter keys that are available
                    for (const [k, item] of Object.entries(s.props as {[key: string]: ISchema})) {
                        const jid = k.replace("\\", "\\\\").replace('"', '\\"');
                        const ielem = elem.querySelector(`:scope > div > [jid="${jid}"]`) as HTMLElement;
                        if (!ielem) throw Error("object props is missing jid element");
                        const out = load(ver, v, k, ielem, item as any);
                        nkeys.push(k);

                        // Load extra enum fields
                        if (item.type == "enum" && item.more) {
                            // console.log(ielem);
                            let melem = ielem.nextElementSibling;
                            while (melem?.tagName == "HR") melem = melem?.nextElementSibling;
                            if (!melem) throw Error("object props with enum is missing more element");
                            melem.innerHTML = JSONED.htmls[`more-${melem.getAttribute("jmore")}-${out}`];

                            const morez = item.more[out];
                            if (morez) {
                                // Transform more aliases
                                if (item.talias && item.talias[out]) {
                                    for (const [oldk, newk] of Object.entries(item.talias[out])) {
                                        if (has(v, oldk)) {
                                            set(v, newk, get(v, oldk));
                                            del(v, oldk, true);
                                        }
                                    }
                                }

                                for (const [mk, mitem] of Object.entries(morez)) {
                                    ok.add(mk);
                                    nkeys.push(mk);
                                    // console.log(mk, mitem, melem);
                                    const loadMore = melem.querySelector(`:scope > div > [jid="${escape(mk)}"]`) as HTMLElement;
                                    if (!loadMore) throw Error("object more is missing jid element");
                                    load(ver, v, mk, loadMore, mitem as any);
                                }
                            }
                        }
                    }

                    // Then leftover keys are loaded into extra if available, or are deleted when unused
                    for (const k of keys(v)) {
                        if (!(k in s.props) && !(ok.has(k))) leftover.push(k);
                    }
                } else {
                    leftover = keys(v);
                }

                if (rekey) v.rekey(nkeys);

                if (s.extra) {
                    // Detect the type and delete all keys if the type of any extra field is wrong
                    let val = resolve(s.extra, ver);

                    if (val.type != "or") {
                        for (const k of leftover) {
                            const g = get(v, k);
                            const t = (
                                typeof g == "number" && g % 1 == 0 ? "integer" :
                                typeof g == "object" && Array.isArray(g) ? "list" :
                                typeof g
                            );

                            if (t != val.type) {
                                for (const k of leftover) del(v, k, true);
                                return;
                            }
                        }
                    }
                    // Otherwise we can proceed with the load
                    const nlist = elem.lastElementChild?.lastElementChild?.lastElementChild;
                    if (!nlist) throw Error("object extra is missing great grandchild nlist element");

                    // Count number of items in html and correct that number
                    const items = nlist.children;
                    const icount = nlist.childElementCount - 1;


                    if (leftover.length < icount) {
                        // Too many items so we need to remove some
                        for (let i = icount-1; i > leftover.length-1; i--) {
                            items[i].remove();
                        }
                    } else if (leftover.length > icount) {
                        // Too few items so we need to add some
                        const last = items[icount];
                        const lkey = last.getAttribute("key");
                        if (!lkey) throw Error("object extra is missing key attribute");
                        const html = JSONED.htmls[lkey];
                        const htmls: string[] = [];
                        for (let i = icount; i < leftover.length; i++) {
                            htmls.push(`<div class="panel" named jtype="${escape(val.type)}" jid="${escape(leftover[i])}">${html}</div>`);
                        }
                        last.insertAdjacentHTML("beforebegin", htmls.join(""));
                    }

                    // Then load each field into html
                    for (let i = 0; i < leftover.length; i++) load(ver, v, leftover[i], items[i] as HTMLElement, val);
                } else {
                    for (const k of leftover) del(v, k, true);
                }
            } else {
                // Unload the object if it is loaded
                if (v) del(p, k);
                if (btn && btn.parentElement && !hidden) {
                    const hkey = btn.getAttribute("hkey");
                    if (!hkey) throw Error("object button is missing hkey");
                    btn.parentElement.innerHTML = JSONED.htmls[hkey];
                }
            }
            break;
        }
        case "list": {
            // Resolve links
            let val: ISchema = resolve(s.vals, ver);

            if (val.type == "string") {
                // Text lists are a lot easier to load in (we do not resolve links to strings)
                const tarea = elem.querySelector("textarea");
                if (!tarea) throw Error("string list is missing textarea");

                if (Array.isArray(v) && v.every((t) => typeof t == "string")) {
                    tarea.value = v.join("\n");
                } else if (val.default) {
                    tarea.value = val.default;
                } else {
                    tarea.value = "";
                    del(p, k);
                }
            } else {
                // If this object is shown and not loaded, it does need to be loaded
                if (!Array.isArray(v) && s.show) {
                    v = [];
                    set(p, k, v);
                }

                const btn = elem.querySelector(":scope > div > button");
                const hidden = !!elem.querySelector(":scope > div > button > p.bi-plus");

                if (Array.isArray(v)) {
                    // Load the object if it is unloaded
                    if (!s.show && btn && btn.parentElement && hidden) {
                        const lkey = btn.getAttribute("key");
                        if (!lkey) throw Error("list button is missing hkey");
                        btn.parentElement.innerHTML = JSONED.htmls[lkey];
                    }

                    // Add or remove items from the list to balance it's size
                    const items = elem.querySelectorAll(":scope > div > [jtype]");
                    if (v.length < items.length) {
                        // We need to remove some items to match the length
                        for (let i = items.length-1; i > v.length-1; i--) {
                            items[i].remove();
                        }
                    } else if (v.length > items.length) {
                        // We need to add some items to match the length
                        const last = elem?.lastElementChild?.lastElementChild;
                        if (!last) throw Error("list element is missing grandchild");
                        const lkey = last.getAttribute("key");
                        if (!lkey) throw Error("list grandchild element is missing key attribute");
                        const html = JSONED.htmls[lkey];
                        const htmls: string[] = [];
                        for (let i = items.length; i < v.length; i++) {
                            htmls.push(`<div class="panel" jtype="${escape(val.type)}" jid=${i}>${html}</div>`);
                        }
                        last.insertAdjacentHTML("beforebegin", htmls.join(""));
                    } // Otherwise item lengths are equal, so no element shuffling required

                    // Now load each list item individually
                    elem.querySelectorAll(":scope > div > [jtype]").forEach((e, i) => {
                        load(ver, v, i, e as HTMLElement, val);
                    });
                } else {
                    // Unload the object if it is loaded
                    if (v) del(p, k);
                    if (btn && btn.parentElement && !hidden) {
                        const hkey = btn.getAttribute("hkey");
                        if (!hkey) throw Error("list button is missing hkey");
                        btn.parentElement.innerHTML = JSONED.htmls[hkey];
                    }
                }
            }
            break;
        }
        case "tuple":
            if (v === undefined || !Array.isArray(v)) {
                v = Array(s.vals.length).fill(undefined);
                set(p, k, v);
            }
            while (v.length !== s.vals.length) v.push(undefined);

            for (let i = 0; i < s.vals.length; i++) {
                const jidElem = elem.querySelector(`:scope > [jid="${i}"]`) as HTMLElement;
                if (!jidElem) throw Error(`cannot load into tuple element ${i}`);
                load(ver, v, i, jidElem, s.vals[i]);
            }
            break;
        case "enum": {
            const enumF = s.enum.filter((v) => !(typeof v == "string" && v[0] == "$"));
            if (v === undefined) {
                if (!s.unspec) {
                    v = enumF[s.default ?? 0];
                    set(p, k, v);
                }
            } else if (!enumF.includes(v)) {
                if (!s.norepr && v.includes(":")) {
                    v = v.replace("apoli:", "origins:");
                } else {
                    v = s.ns + ":" + v;
                }

                // Convert if field in convert
                if (s.convert && v in s.convert) {
                    v = s.convert[v];
                } else if (!enumF.includes(v)) {
                    v = enumF[s.default ?? 0];
                }
                set(p, k, v);
            }

            const val = `${typeof v}-${v}`;
            e.querySelector("select")!.value = val;
            return val;
        }
        case "image":
            if (v) e.querySelector("img")!.src = v;
            else e.querySelector("img")!.removeAttribute("src");
            break;

        default: {
            if (v === undefined) {
                v = (s as any).default;
                set(p, k, v);
            }

            let input: any = e.querySelectorAll("input, textarea");
            input = input[input.length-1];

            switch (s.type) {
                case "boolean":
                    if (typeof v == "boolean") {
                        input.checked = v;
                    } else {
                        del(p, k);
                        input.checked = false;
                    }
                    break;
                case "string":
                    if (typeof v == "string") {
                        if (s.allow) v = v.replace(new RegExp(`[^${regescape(s.allow)}]+`, "g"), "");
                        if (!v.trim()) v = s.default || "";
                        input.value = v;
                        set(p, k, v);
                    } else {
                        del(p, k);
                        input.value = "";
                    }
                    break;
                case "number":
                case "integer":
                    if (typeof v == "number") {
                        if (s.type == "integer") v = Math.floor(v);
                        if (s.min !== undefined) v = Math.max(s.min, v);
                        if (s.max !== undefined) v = Math.min(v, s.max);
                        input.value = v;
                        set(p, k, v);
                    } else {
                        del(p, k);
                        input.value = "";
                    }
                    break;
            }
            break;
        }
    }
}