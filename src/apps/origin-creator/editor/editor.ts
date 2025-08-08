import { viewSection, $, $$ } from "..";
import { ChangeTree, PROJECT, refreshTree, save } from "../projects";
import { JSONED } from "./global";
import { load, updatePanels } from "./load";
import { del, set } from "./wrapper";

export class Editor {
    regex: RegExp;
    type: string;
    link?: string;
    htmlKey?: string;

    constructor(regex?: string, type?: string, link?: string, htmlKey?: string) {
        this.regex = new RegExp(regex ?? ".*");
        this.type = type ?? "none";
        this.link = link;
        this.htmlKey = htmlKey;
    }

    match(path: string): boolean {
        return !!path.match(this.regex);
    }

    use(path: string) {
        PROJECT.type = "";

        const parent = PROJECT.parent;
        const key = PROJECT.active;

        // Hide any open editors
        $$("#workspace > div > div:not([hidden])").forEach((elem) => {
            elem.toggleAttribute("hidden");
        });
        PROJECT.changeTree = null;

        // Load specific editor type
        switch (this.type) {
            // The none editor shows nothing
            case "none": break;
            // Linked editors have built html to use
            case "link": {
                if (!this.link) throw Error("No link for link editor!");
                if (!this.htmlKey) throw Error("No htmlkey for link editor!");

                PROJECT.type = this.link;

                // Ensure proper data type
                if (typeof parent[key] == "string") {
                    try {
                        parent[key] = JSON.parse(parent[key]);
                    } catch (err) {
                        parent[key] = {};
                    }
                }
                update(false);

                // Show raw editor
                $("#raw-btns")?.removeAttribute("hidden");
                $("#raw")?.removeAttribute("hidden");

                // Switch change tree
                if (localStorage.getItem("ocdur") == null) {
                    if (!(path in PROJECT.changeTrees)) {
                        PROJECT.changeTrees["meta"] = new ChangeTree(parent[key]);
                    }
                    PROJECT.changeTree = PROJECT.changeTrees[path];
                }

                // Show editor
                const editorElem = $("#editor") as HTMLElement;
                editorElem.removeAttribute("hidden");
                editorElem.innerHTML = JSONED.htmls[this.htmlKey];

                // Do the load
                load(PROJECT.ver, parent, key, editorElem.firstElementChild as HTMLElement);
                break;
            }
            // Images have a special div they are loaded into
            case "image": {
                const imgdiv = $("#image") as HTMLElement;
                const img = imgdiv.firstElementChild as HTMLImageElement;
                img.removeAttribute("height");

                if (parent[key]) {
                    img.src = "data:image;base64,"+parent[key].substring(5);
                    img.removeAttribute("style");
                    img.onload = () => {
                        if (img.naturalHeight < 32) {
                            img.height = img.naturalHeight * 16;
                            img.style.imageRendering = "pixelated";
                        } else if (img.naturalHeight < 64) {
                            img.height = img.naturalHeight * 4;
                            img.style.imageRendering = "pixelated";
                        }
                    };
                } else {
                    img.src = "";
                }

                imgdiv.removeAttribute("hidden");
                break;
            }
            case "audio": {
                const audiodiv = $("#audio") as HTMLElement;
                if (parent[key]) {
                    audiodiv.innerHTML = `<audio controls preload autobuffer src="data:audio;base64,${parent[key].substring(5)}"></audio>`;
                } else {
                    audiodiv.innerHTML = "<audio controls></audio>";
                }
                audiodiv.removeAttribute("hidden");
                break;
            }
            // Raw text editors use the ACE code editor.
            case "mcfunction": case "javascript": case "json": case "text": {
                PROJECT.changeTree = null;

                // Show other editor
                $("#other")?.removeAttribute("hidden");

                // Ensure proper data type
                if (this.type == "json") {
                    if (typeof parent[key] == "string") {
                        try {
                            const out = JSON.parse(parent[key]);
                            if (typeof(out) == "object") parent[key] = out;
                        } catch (err) {}
                    }
                }

                // Give syntax highlighting
                window["ace_rother"].getSession().setMode(`ace/mode/${this.type}`);

                // Load into other
                window["ace_rother"].setValue(
                    typeof parent[key] == "string" ? parent[key] : JSON.stringify(parent[key], null, 4),
                -1);
                break;
            }
        }

        // Show loaded stuff
        viewSection("workspace");
        updatePanels();
    }
}

export const DEFAULT_EDITOR = new Editor();

// A gentle nudge to Barry, Beatrice, and Betty
export function _fixBarry(parent: {[k: string]: any}): boolean {
    let fixed = false;
    for (const [k, v] of Object.entries(parent)) {
        if (k.trim().length == 0) {
            del(parent, k);
            set(parent, "f"+String(Math.random()).slice(2, 15), v);
            fixed = true;
        } else if (k.trim() == "/") {
            del(parent, k);
            if (_fixBarry(v)) fixed = true;
            set(parent, "f"+String(Math.random()).slice(2, 15)+"/", v);
        } else if (k[k.length-1] == "/") {
            if (_fixBarry(v)) fixed = true;
        }
    }
    return fixed;
}
export function fixBarry() {
    if (!_fixBarry(PROJECT.data)) return;
    refreshTree();
    queueSave();
}

// Handle editor updates
let saveQueued = 0;
export function update(andsave: boolean = true) {
    const data = PROJECT.parent[PROJECT.active];
    if (data !== undefined) {
        window["ace_rawr"].setValue(JSON.stringify(data, null, 4), -1);
    }
    if (andsave) {
        if (PROJECT.changeTree) PROJECT.changeTree.record();
        queueSave();
    }
}
export function popSave() {
    if (saveQueued > 1) {
        saveQueued = 1;
        return;
    } else if (saveQueued > 0) {
        saveQueued = 0;
        save();
    }
}
export function queueSave() {
    saveQueued = 2;
}
setInterval(popSave, 3000);
// Unfocus any element to cause it to save
window.addEventListener("beforeunload", () => {window.focus(); return false;});
window.addEventListener("beforeunload", () => {if (saveQueued > 0) {save(); saveQueued = 0;}});