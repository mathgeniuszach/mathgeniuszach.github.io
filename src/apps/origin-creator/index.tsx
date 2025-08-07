import React from "react";

import { render } from "react-dom";

import { unescape } from "lodash";
import { saveAs } from "file-saver";

import { block, Blocker, unblock } from "./component/backdrop";
import { Sidebar } from "./component/sidebar";
import { Editor } from "./editor/editor";
import { Ace } from "./component/ace";
import { PROJECT, Projects, refreshTree, save, setProjectSettings, updateName, updatePRaw, updateUsedSize } from "./projects";

import { load as loadYaml, JSON_SCHEMA} from 'js-yaml';
import { copyNode, cutNode, cloneNode, deleteNode, pasteNode } from "./component/jstree";
import { JSONED } from "./editor/global";
import { del, get, set } from "./editor/wrapper";
import { expand } from "./editor/build";

import { fetchZip, ocrepo } from "./params";
import { updatePanels } from "./editor/load";
import { oc } from "./editor/api";

export const $: (query: string) => HTMLElement | null = document.querySelector.bind(document);
// eslint-disable-next-line no-undef
export const $$: (query: string) => NodeListOf<HTMLElement> = document.querySelectorAll.bind(document);

export const DEFAULT_FORMAT = 10;
export const UNDO_TREE_LENGTH = 20;
export const IMAGE_FILES = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
export const KNOWN_FILES = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".mcmeta", ".json", ".txt", ".mcfunction", ".ogg", ".md", ".obj", ".mcshader", ".glsl", ".vs", ".fs"];

async function grab(url: string, k: string | number): Promise<string> {
    return (await fetch(url + "?k=" + k)).text();
}

export function Icon(props) {
    return <p className={"bi bi-" + props.type}></p>;
}

export function viewSection(id: string) {
    const nh = $("section:not([hidden])");
    if (nh) nh.setAttribute("hidden", "");

    if (id == "workspace" && !PROJECT.active) return;
    if (id == "projects") updatePRaw();
    $("#"+id).removeAttribute("hidden");
}

// Change theme of ace editors
function change_themes() {
    let theme = localStorage.getItem("theme") ?? "system";
    if (theme == "light" || theme == "system" && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = "ace/theme/contrast";
    } else {
        theme = "ace/theme/monokai";
    }

    window["ace_rawr"].setOptions({theme: theme});
    window["ace_rother"].setOptions({theme: theme});
    window["ace_praw"].setOptions({theme: theme});
    window["ace_macros"].setOptions({theme: theme});
}

// Render raw editor
const rawdiv = $("#raw");
render(<Ace name="rawr" mode="json" height="200px" hidden/>, rawdiv);
render(
    (<>
        <button className="normal" title="Toggle the visibility of the raw editor." onClick={() => {
            update(false);
            $("#rawr").toggleAttribute("hidden");
            const buttons = rawdiv.previousElementSibling.querySelectorAll("button");
            buttons[1].toggleAttribute("hidden");
            buttons[2].toggleAttribute("hidden");
        }}><Icon type="code-slash"/></button>
        <button hidden className="normal" title="Load the changes you made in the raw editor into the Origin Creator." onClick={() => {
            PROJECT.parent[PROJECT.active] = JSON.parse(window["ace_rawr"].getValue());
            const id = PROJECT.aid.split("-");
            editors[id[1]][id[0]].reload();
            updateName();
        }}><Icon type="arrow-up-circle"/></button>
        <button hidden className="normal" title="Refresh the raw editor's content, undoing any changes made in the editor, but not on the page." onClick={() => {
            update(false);
        }}><Icon type="arrow-clockwise"/></button>
        <button className="normal" title="Download the raw as a json file." onClick={() => {
            let fname = PROJECT.active || "file.json";
            if (!fname.includes(".") || !KNOWN_FILES.includes(fname.substring(fname.lastIndexOf(".")))) fname += ".json";

            saveAs(
                new Blob(
                    [JSON.stringify(PROJECT.parent[PROJECT.active], null, 4)],
                    {type: "text/json;charset=utf-8"}
                ),
                fname
            );
        }}><Icon type="download"/></button>
    </>),
    rawdiv.previousElementSibling
);

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
    if (PROJECT.active) {
        const data = PROJECT.parent[PROJECT.active];
        if (data !== undefined) {
            window["ace_rawr"].setValue(JSON.stringify(data, null, 4), -1);
        }
    }
    if (andsave) {
        fixBarry();
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

// Render backdrop
render(<Blocker/>, $("#backdrop"));
// Render sidebar
render(<Sidebar/>, $("aside"));
// Render projects
render(<Projects/>, $("#projects"));
setProjectSettings();

// Render editors
let dir;
const editors: {[ver: string]: {[key: string]: Editor}} = {};
window.addEventListener("DOMContentLoaded", async () => {
    block();

    try {
        // Make all links open in new tabs
        document.querySelectorAll("section a:not(.yt-embed):not([target=_blank])").forEach(
            e => e.setAttribute("target", "_blank")
        );

        // Load all schemas from github
        oc.print("Downloading repo:\n"+ocrepo);
        console.log("Downloading repo:\n"+ocrepo);
        const schemas = await fetchZip(ocrepo);

        // Get schema director
        dir = loadYaml(await schemas.file("dir.yaml").async("text"), {schema: JSON_SCHEMA});
        oc.print(`Loading schemas (v${dir.$}) from:\n`+ocrepo);
        console.log(`Loading schemas (v${dir.$})`);
        delete dir.$;

        const wdiv = $("#workspace > div");

        // Gather all schemas
        await Promise.all(Object.keys(dir).map((ver) =>
            Promise.all(dir[ver].map(async (name) => {
                // Insert editor div into html
                const id = `${name}-${ver}`;
                wdiv.insertAdjacentHTML("beforeend", `<div id="${id}" hidden></div>`);

                // Download schema from online
                const schema = (await schemas.file(`${ver}/${name}.yaml`).async("text"));
                JSONED.schemas[id] = loadYaml(schema, {schema: JSON_SCHEMA});
            }))
        ));

        // Expand all schemas
        for (const ver in dir) {
            for (const name of dir[ver]) {
                const id = `${name}-${ver}`;
                if (JSONED.schemas[id]) {
                    try {
                        expand(id, JSONED.schemas[id]);
                    } catch (err) {
                        console.error(`Error expanding ${id};`, err);
                        delete JSONED.schemas[id];
                    }
                }
            }
        }

        // Build all schemas
        for (const ver in dir) {
            editors[ver] = {};

            for (const name of dir[ver]) {
                // Build schema in editor
                const id = `${name}-${ver}`;
                try {
                    if (JSONED.schemas[id]) editors[ver][name] = new Editor(id, JSONED.schemas[id]);
                } catch (err) {
                    console.error(`Error building ${name}-${ver};`, err);
                }
            }
        }

        // Resolve all built links
        function fixLinks(html: string): string {
            let links = new Set<string>();
            let out = html;

            while (out.includes("<@")) {
                const nlinks = [];

                out = out.replace(/<@(.*?)@(.*?)>/g, (_, id, link) => {
                    // Locate the newest html for the current file version:
                    const suffix = "-link-" + unescape(link);

                    let key: string;
                    const [file, sver] = id.split("-");
                    let ver = parseInt(sver);
                    do {
                        key = `${file}-${ver}${suffix}`;
                    } while (!(key in JSONED.htmls) && --ver > 0);

                    if (links.has(key)) throw Error(`infinite illegal recursive loop in link "${unescape(key)}".`);
                    nlinks.push(key);
                    
                    if (!(key in JSONED.htmls)) throw Error(`Unknown link "${unescape(`${id}@${link}`)}"`);
                    return JSONED.htmls[key];
                });
                for (const link of nlinks) links.add(link);
            }
            return out;
        }
        for (const [k, html] of Object.entries(JSONED.htmls)) {
            JSONED.htmls[k] = fixLinks(html);
        }

        // Import html into all editors
        for (const ver in dir) {
            for (const name of dir[ver]) {
                if (editors[ver][name]) editors[ver][name].reset();
            }
        }

        oc.print("Loading complete. Welcome to the Origin Creator!");

        fixBarry();

        // Update displayed used size
        updateUsedSize();

        // Make the theme changer work
        change_themes();
        (window as any).onthemechange = change_themes;

        unblock();
    } catch (e) {
        oc.print("Failure to load schemas: "+e, "error");
        console.error(e);
    }
});
// And render other editor
render(<Ace name="rother" mode="text" height="500px" save={(text) => {
    if (window["ace_rother"].getSession().getMode() == "ace/mode/json") {
        try {
            PROJECT.parent[PROJECT.active] = JSON.parse(text);
            save();
            return;
        } catch (err) {}
    }
    PROJECT.parent[PROJECT.active] = text;
    save();
}}/>, $("#other"));


// Selected is initialized browser, don't be a weirdo
globalThis.selected = null;
globalThis.selected = null;
globalThis.selected = null;

export function loadEditor(type: string, heading: string | null) {
    // Deselect anything if it's selected
    if (globalThis.selected) {
        globalThis.selected?.classList?.remove("panel-sel");
        globalThis.selected = null;
    }

    if (heading) $("h2").textContent = heading;
    const parent = PROJECT.parent;
    const key = PROJECT.active;
    PROJECT.type = type;

    // Hide all shown editors
    document.querySelectorAll("#workspace > div > div:not([hidden])").forEach((elem) => {
        elem.toggleAttribute("hidden");
    });

    // If image, show image
    const extLoc = key.lastIndexOf(".");
    let ext = "";
    if (extLoc >= 0) {
        ext = key.substring(extLoc);
        if (IMAGE_FILES.includes(ext)) {
            // Load image
            const imgdiv = $("#image");
            const img = (imgdiv.firstElementChild as HTMLImageElement);
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

            // Show loaded stuff
            viewSection("workspace");

            updatePanels();
            return;
        }
    }

    // Try to find if a versioned editor exists for this type
    let ver = get(PROJECT.data.meta, "pack_format") ?? DEFAULT_FORMAT;
    if (ver < 6) ver = 6;
    if (ver == 6) {
        if (!editors[6] || !editors[6][type]) {
            if (editors[DEFAULT_FORMAT] && editors[DEFAULT_FORMAT][type]) ver = DEFAULT_FORMAT;
            else ver = 0;
        }
    } else {
        while (!editors[ver] || !editors[ver][type]) {
            if (ver < 6) {
                ver = 0;
                break;
            }
            ver--;
        }
    }

    if (ver != 0) {
        // If an editor exists for this type

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
        $("#raw-btns").removeAttribute("hidden");
        rawdiv.removeAttribute("hidden");

        // Show editor
        PROJECT.aid = `${type}-${ver}`;
        $("#"+PROJECT.aid)?.removeAttribute("hidden");

        // Do the load
        editors[ver][type].reload();
    } else {
        // If an editor does not exist for this type
        PROJECT.changeTree = null;

        // Show other editor
        $("#other").removeAttribute("hidden");

        // Ensure proper data type
        if (!ext || ext == ".json") {
            if (typeof parent[key] == "string") {
                try {
                    const out = JSON.parse(parent[key]);
                    if (typeof(out) == "object") parent[key] = out;
                } catch (err) {}
            }
        }

        // Give syntax highlighting
        window["ace_rother"].getSession().setMode(
            type == "functions" ? "ace/mode/mcfunction" :
            type == "scripts" ? "ace/mode/javascript" :
            !ext || ext == ".json" ? "ace/mode/json" :
            "ace/mode/text"
        );

        // Load into other
        window["ace_rother"].setValue(
            typeof parent[key] == "string" ? parent[key] : JSON.stringify(parent[key], null, 4),
        -1);
    }

    // Show loaded stuff
    viewSection("workspace");
    updatePanels();
}

const ntags = new Set(["INPUT", "TEXTAREA", "SELECT", "BUTTON", "P", "A"]);
document.addEventListener("mousedown", (e) => {
    if (e.button != 0) return;

    const target = e.target as HTMLElement;
    if (target.classList.contains("ace_editor")) {
        // Resize editors
        const onmove = () => {
            window["ace_"+target.id].resize();
        };
        const onup = () => {
            document.removeEventListener("mousemove", onmove);
            document.removeEventListener("mouseup", onup);
        };
        document.addEventListener("mousemove", onmove);
        document.addEventListener("mouseup", onup);
    } else if (target.tagName == "ASIDE") {
        // Resize editors
        const onmove = () => {
            const w = target.style.width;
            if (w) {
                const s = parseInt(w.substring(0, w.length-2));
                if (s <= 210) document.documentElement.removeAttribute("style");
                else document.documentElement.style.setProperty('--sidebar-width', w);
            }
        };
        const onup = () => {
            document.removeEventListener("mousemove", onmove);
            document.removeEventListener("mouseup", onup);
            target.removeAttribute("style");
        };
        document.addEventListener("mousemove", onmove);
        document.addEventListener("mouseup", onup);
    } else if (ntags.has(target.tagName)) {
        if (globalThis.selected) {
            globalThis.selected.classList.remove("panel-sel");
            globalThis.selected = null;
        }
        if (target.classList.contains("jstree-clicked")) {
            viewSection("workspace");
        }
    } else {
        const sel: HTMLElement = target.closest("#workspace") && target.closest(".panel, .panel-dark");
        if (globalThis.selected) {
            globalThis.selected.classList.remove("panel-sel");
            if (sel == globalThis.selected) {
                globalThis.selected = null;
                return;
            }
        }

        if (sel && sel.parentElement.tagName != "ASIDE") {
            globalThis.selected = sel;
            sel.classList.add("panel-sel");
        } else {
            globalThis.selected = null;
        }
    }
});
// Handle keyboard shortcuts and buttons
let clipboard = localStorage.getItem("occ");
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && (e.key == "s" || e.key == "S")) {
        save();
        e.preventDefault();
        return;
    }

    if (PROJECT.changeTree && e.ctrlKey && e.key == "z") {
        PROJECT.changeTree.undo();
        e.preventDefault();
        return;
    }
    if (PROJECT.changeTree && e.ctrlKey && (e.key == "Z" || e.key == "y")) {
        PROJECT.changeTree.redo();
        e.preventDefault();
        return;
    }

    const sel = document.activeElement as HTMLElement;
    if (sel) {
        if (sel.classList.contains("jstree-anchor")) {
            if (sel.parentElement.id == "j1_1_anchor") return;

            if (e.key == "Delete") {
                deleteNode(sel.parentElement.id);
                e.preventDefault();
            } else if (e.ctrlKey) {
                switch (e.key) {
                    case "X":
                    case "x":
                        cutNode(sel.parentElement.id);
                        e.preventDefault();
                        break;
                    case "C":
                    case "c":
                        copyNode(sel.parentElement.id);
                        e.preventDefault();
                        break;
                    case "V":
                    case "v":
                        pasteNode(sel.parentElement.id);
                        e.preventDefault();
                        break;
                    case "D":
                    case "d":
                        cloneNode(sel.parentElement.id);
                        e.preventDefault();
                        break;
                }
            }
        } else if (globalThis.selected) {
            if (e.key == "Delete") {
                // Delete item data
                const [p, k] = JSONED.findData(globalThis.selected, PROJECT.aid);
                if (Array.isArray(p)) {
                    p.splice(k as any, 1);
                } else {
                    del(p, k);
                }

                // Remove selection
                globalThis.selected.classList.remove("panel-sel");
                globalThis.selected = null;

                // FIXME: Reload specific content instead of everything
                const id = PROJECT.aid.split("-");
                editors[id[1]][id[0]].reload();

                e.preventDefault();
            } else if (e.ctrlKey) {
                if (e.key == "Control") return;

                switch (e.key) {
                    case "X":
                    case "x": {
                        // Copy item data
                        const [p, k] = JSONED.findData(globalThis.selected, PROJECT.aid);
                        clipboard = JSON.stringify(get(p, k));
                        localStorage.setItem("occ", clipboard);

                        // Then delete it
                        if (Array.isArray(p)) {
                            p.splice(k as any, 1);
                        } else {
                            del(p, k);
                        }

                        update();

                        // FIXME: Reload specific content instead of everything
                        const id = PROJECT.aid.split("-");
                        editors[id[1]][id[0]].reload();

                        e.preventDefault();
                        break;
                    }
                    case "C":
                    case "c": {
                        // Copy to clipboard
                        const [p, k] = JSONED.findData(globalThis.selected, PROJECT.aid);
                        clipboard = JSON.stringify(get(p, k));
                        localStorage.setItem("occ", clipboard);

                        // Some user interactivity
                        globalThis.selected.classList.remove("panel-sel");
                        globalThis.selected = null;

                        e.preventDefault();
                        break;
                    }
                    case "V":
                    case "v": {
                        if (clipboard != null) {
                            // Write to item
                            const [p, k] = JSONED.findData(globalThis.selected, PROJECT.aid);
                            set(p, k, JSON.parse(clipboard));

                            // FIXME: Reload specific content instead of everything
                            const id = PROJECT.aid.split("-");
                            editors[id[1]][id[0]].reload();

                            update();

                            e.preventDefault();
                        }
                        break;
                    }
                    case "D":
                    case "d": {
                        const cloneBtn = globalThis.selected.firstElementChild?.lastElementChild as HTMLElement;
                        if (cloneBtn && cloneBtn.tagName == "BUTTON") cloneBtn.click();
                        e.preventDefault();
                        break;
                    }
                }
            }
        }
    }

    if (e.key in oc.macros) {
        oc.macros[e.key]();
        e.preventDefault();
    }
});
// Handle file drag and drop
document.body.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    PROJECT.handleImport(files);
    e.preventDefault();
});



// Load and run autorun
window["ace_macros"]?.setValue(localStorage.getItem("ocar") ?? "");

export function autorun() {
    oc.clean();

    const code = window["ace_macros"]?.getValue();
    localStorage.setItem("ocar", code);
    if (localStorage.getItem("oceor") != null) {
        try {
            // WARNING, NUCLEAR CODE INCOMING
            // BWAH-BWAH, BWAH-BWAH, BWAH-BWAH

            // More seriously, this isn't an issue for these reasons:
            // 1. This is a static website. There is no server being interacted with.
            // 2. There is no private data. Even exported files are basically public data.
            // 3. I actually want people to be able to mess with the global namespace and modify the creator.

            // Parcel has problems with the eval function, so this is a work-around.
            window["eval"](code);
        } catch (err) {
            console.error(err);
            oc.print(String(err), "error");
        }
        oc.print("Autorun code saved and loaded.");
    }
}

console.log("Think before you type into this box. Don't run code you don't trust.");

autorun();
