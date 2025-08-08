import React from "react";
import { render } from "react-dom";
import { saveAs } from "file-saver";

import { block, Blocker, unblock } from "./component/backdrop";
import { Sidebar } from "./component/sidebar";
import { Ace } from "./component/ace";
import { PROJECT, Projects, refreshTree, save, setProjectSettings, updateName, updatePRaw, updateUsedSize } from "./projects";

import { copyNode, cutNode, cloneNode, deleteNode, pasteNode, getTree } from "./component/jstree";
import { JSONED } from "./editor/global";
import { del, get, set } from "./editor/wrapper";

import { oc } from "./editor/api";
import { loadSchemas, checkSchemas } from "./editor/schema";

import { build, resolve } from "./editor/build";
import { DEFAULT_EDITOR, Editor, fixBarry, update } from "./editor/editor";

export const $: (query: string) => HTMLElement | null = document.querySelector.bind(document);
// eslint-disable-next-line no-undef
export const $$: (query: string) => NodeListOf<HTMLElement> = document.querySelectorAll.bind(document);

export const DEFAULT_FORMAT = 10;
export const UNDO_TREE_LENGTH = 20;
export const IMAGE_FILES = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
export const KNOWN_FILES = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".mcmeta", ".json", ".txt", ".mcfunction", ".ogg", ".md", ".obj", ".mcshader", ".glsl", ".vs", ".fs"];

export function Icon(props) {
    return <p className={"bi bi-" + props.type}></p>;
}

export function viewSection(id: string) {
    const nh = $("section:not([hidden])");
    if (nh) nh.setAttribute("hidden", "");

    // Deselect file in tree if showing other page
    if (id != "workspace") {
        getTree().deselect_all(true);
    }

    if (id == "projects") updatePRaw();
    $("#"+id)?.removeAttribute("hidden");
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
const rawdiv = $("#raw") as HTMLElement;
const prediv = rawdiv?.previousElementSibling as HTMLElement;
render(<Ace name="rawr" mode="json" height="200px" hidden/>, rawdiv);
render(
    (<>
        <button className="normal" title="Toggle the visibility of the raw editor." onClick={() => {
            update(false);
            $("#rawr")?.toggleAttribute("hidden");
            const buttons = prediv.querySelectorAll("button");
            buttons[1]?.toggleAttribute("hidden");
            buttons[2]?.toggleAttribute("hidden");
        }}><Icon type="code-slash"/></button>
        <button hidden className="normal" title="Load the changes you made in the raw editor into the Origin Creator." onClick={() => {
            PROJECT.parent[PROJECT.active] = JSON.parse(window["ace_rawr"].getValue());
            JSONED.refresh();
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
    prediv
);

// Render backdrop
render(<Blocker/>, $("#backdrop"));
// Render sidebar
render(<Sidebar/>, $("aside"));
// Render projects
render(<Projects/>, $("#projects"));
setProjectSettings();

// Load and build schemas
async function loadAndBuildSchemas() {
    // Load schema data from repos
    console.log("Loading schemas...");

    if (!("oc-repos" in localStorage)) {
        localStorage.setItem("oc-repos", "default-schemas");
    }
    const ocrepos = localStorage.getItem("oc-repos") as string;

    // When you code at 3AM, this is what you get:
    // Sam C Bertai would make a funny scam baiter name

    const repos = ocrepos.split(/[\r\n]+/g).flatMap(
        v => {
            const tv = v.trim();
            if (tv[0] == "#") return [];
            if (tv == "default-schemas") return "github://mathgeniuszach/origin-creator-schemas/dev";
            return tv;
        }
    );

    const patchErrors = await loadSchemas(repos);

    // Update origin creator repo data
    const textarea = document.getElementById("repo-toggles") as HTMLTextAreaElement;
    textarea.value = ocrepos;
    textarea.addEventListener("change", ev => {
        localStorage.setItem("oc-repos", (ev.target as HTMLTextAreaElement).value);
    });
    
    // If any errors have occurred, print them and exit early
    let errored = false;
    for (const [repo, repoPatchErrors] of Object.entries(patchErrors)) {
        if (repoPatchErrors.length > 0) {
            const errMessage = `${patchErrors.length} errors loading\n"${repo}"`;
            console.error(errMessage);
            PROJECT.showSnack(errMessage, "error");
            errored = true;
        }
    }
    if (errored) return;
    
    // Check schemas for errors
    console.log("Checking schemas for errors...");
    PROJECT.showSnack("Checking schemas for errors...");
    const schemaErrors = checkSchemas();
    if (schemaErrors.length > 0) {
        const errMessage = `${schemaErrors.length} errors with schema data`;
        PROJECT.showSnack(errMessage, "error");
        for (const schemaError of schemaErrors) console.error(schemaError);
        return;
    }

    // Build all editors, resolving links when necessary
    console.log("Building schemas...");
    PROJECT.showSnack("Building schemas...");

    const buildErrors: string[] = [];
    const linkHTMLs: {[ver: number]: {[link: string]: string | number}} = {};

    // Function for resolving links. Link html is cached so no link is built twice.
    function correct(input: string): string {
        let html = input;
        while (html.includes("<oclink")) {
            html = html.replace(
                /<oclink\s+ver="(.*?)"\s+to="(.*?)"\s+show="(.*?)"\s+panel="(.*?)"\s*\/>/g,
                (_, lver, lto, lshow, lpanel) => buildLink(
                    parseInt(lver), lto,
                    lshow == "undefined" ? undefined : lshow == "true",
                    lpanel == "undefined" ? undefined : lpanel == "true"
                )
            );
        }
        return html;
    }

    // Function for building links. Link html is cached so no link is built twice.
    function buildLink(ver: number, link: string, show?: boolean, panel?: boolean): string {
        if (!(ver in linkHTMLs)) linkHTMLs[ver] = {};
        const linkHTML = linkHTMLs[ver];

        if (!(link in linkHTML)) {
            // Placeholder, if encountered, a link depends on itself, which means error
            linkHTML[link] = 0;
            linkHTML[link] = correct(build(JSONED.mschemas[ver].links[link], ver, false, true));
        }

        let out = linkHTML[link];
        if (typeof out == "number") throw Error(`Link "${link}" depends on itself!`);

        // Make minor changes based on "show" and "panel" arguments

        let match = out.match(/^<div(?:\s+shown=["'](\d+)["'])?(\s+class=["']panel["'])?>/);
        if (!match) return out; // No match, nothing to show or change panel type of.

        // Change show state
        if (show && match[1]) {
            // If show is true and the html is not shown, use shown html instead
            out = correct(JSONED.htmls[`code-${match[1]}`]);

            // Re-match on new html
            match = out.match(/^<div(?:\s+shown=["'](\d+)["'])?(\s+class=["']panel["'])?>/);
            if (!match) return out; // No match, nothing change panel type of.
        }

        // Change panel state
        // If panel is undefined, panel state doesn't need to be changed
        if (panel == undefined) return out;
        if (panel) {
            // Without a panel, add one
            if (!match[2]) out = '<div class="panel">' + out.substring(match[0].length);
        } else {
            // With a panel, remove it
            if (match[2]) out = "<div>" + out.substring(match[0].length);
        }

        return out;
    }

    // Build out each schema, using the buildLink() function
    const editorHTMLs: {[key: string]: string} = {};
    for (const [mver, mschema] of Object.entries(JSONED.mschemas)) {
        const meditors: Editor[] = [];
        // Build links for each editor
        for (const editor of mschema.editors) {
            if (editor.type != "link") {
                meditors.push(new Editor(editor.regex, editor.type));
            } else {
                try {
                    const key = `${editor.link}-${mver}`;
                    if (!(key in editorHTMLs)) {
                        const nmver = parseInt(mver);
                        const type = resolve(JSONED.mschemas[mver].links[editor.link], nmver).type;
                        editorHTMLs[key] = `<div jtype="${type}">${buildLink(nmver, editor.link ?? "", true, false)}</div>`;
                    }
                    meditors.push(new Editor(editor.regex, editor.type, editor.link, key));
                } catch (err) {
                    console.error(err);
                    buildErrors.push(`Error building editor link "${editor.link}";\n${err}`);
                }
            }
        }
        JSONED.editors[mver] = meditors;
    }
    
    // Fix any extra htmls with loose links
    for (const k of Object.keys(JSONED.htmls)) {
        try {
            JSONED.htmls[k] = correct(JSONED.htmls[k]);
        } catch (err) {
            console.error(err);
            buildErrors.push(`Error resolving links of html at id "${k}";\n${err}`);
        }
    }

    // Fuse htmls with editor htmls
    for (const [k, v] of Object.entries(editorHTMLs)) {
        JSONED.htmls[k] = v;
    }

    // If build errors occur, delete all editors
    if (buildErrors.length > 0) {
        JSONED.editors = {};
        const errMessage = `${buildErrors.length} errors while building html`;
        PROJECT.showSnack(errMessage, "error");
        return;
    }

    console.log("Loading complete. Welcome to the Origin Creator!");
    PROJECT.showSnack("Loading complete. Welcome to the Origin Creator!");
}

window.addEventListener("DOMContentLoaded", async () => {
    block();

    // Update displayed used size
    updateUsedSize();

    // Make the theme changer work
    change_themes();
    (window as any).onthemechange = change_themes;

    // Make all urls on the help page in new tabs
    $$("section a:not(.yt-embed):not([target=_blank])").forEach(e => e.setAttribute("target", "_blank"));

    // Loading and building schemas based on given repos.
    await loadAndBuildSchemas();

    fixBarry();

    unblock();
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

export function loadEditor(path: string, heading?: string) {
    // Deselect anything if it's selected
    if (globalThis.selected) {
        globalThis.selected?.classList?.remove("panel-sel");
        globalThis.selected = null;
    }

    // Update editor values
    const h2 = $("h2");
    if (h2 && heading) h2.textContent = heading;
    if (path) PROJECT.path = path;

    // Try to find if a versioned editor exists for this file
    let ver = get(PROJECT.data.meta, "pack_format") ?? DEFAULT_FORMAT;
    while (!(ver in JSONED.editors) && ver > 0) ver--;
    PROJECT.ver = ver;

    // Try to use each editor from top to bottom
    // console.log(path);
    for (const editor of JSONED.editors[PROJECT.ver]) {
        if (editor.match(path)) {
            editor.use(path);
            return;
        }
    }

    // No editor matches - use the default editor
    DEFAULT_EDITOR.use(path);
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
        const sel = target.closest("#workspace") && target.closest(".panel, .panel-dark");
        if (globalThis.selected) {
            globalThis.selected.classList.remove("panel-sel");
            if (sel == globalThis.selected) {
                globalThis.selected = null;
                return;
            }
        }

        if (sel && sel?.parentElement?.tagName != "ASIDE") {
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

    const sel = document.activeElement;
    if (sel) {
        if (sel.classList.contains("jstree-anchor")) {
            const psel = sel.parentElement;
            if (!psel || psel?.id == "j1_1_anchor") {

            } else if (e.key == "Delete") {
                deleteNode(psel.id);
                e.preventDefault();
            } else if (e.ctrlKey) {
                switch (e.key) {
                    case "X":
                    case "x":
                        cutNode(psel.id);
                        e.preventDefault();
                        break;
                    case "C":
                    case "c":
                        copyNode(psel.id);
                        e.preventDefault();
                        break;
                    case "V":
                    case "v":
                        pasteNode(psel.id);
                        e.preventDefault();
                        break;
                    case "D":
                    case "d":
                        cloneNode(psel.id);
                        e.preventDefault();
                        break;
                }
            }
        } else if (globalThis.selected) {
            if (e.key == "Delete") {
                // Delete item data
                const [p, k] = JSONED.findData(globalThis.selected, PROJECT.ver);
                if (Array.isArray(p)) {
                    p.splice(k as any, 1);
                } else {
                    del(p, k);
                }

                // Remove selection
                globalThis.selected.classList.remove("panel-sel");
                globalThis.selected = null;

                // FIXME: Reload specific content instead of everything
                JSONED.refresh();

                e.preventDefault();
            } else if (e.ctrlKey) {
                if (e.key == "Control") return;

                switch (e.key) {
                    case "X":
                    case "x": {
                        // Copy item data
                        const [p, k] = JSONED.findData(globalThis.selected, PROJECT.ver);
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
                        JSONED.refresh();

                        e.preventDefault();
                        break;
                    }
                    case "C":
                    case "c": {
                        // Copy to clipboard
                        const [p, k] = JSONED.findData(globalThis.selected, PROJECT.ver);
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
                            const [p, k] = JSONED.findData(globalThis.selected, PROJECT.ver);
                            set(p, k, JSON.parse(clipboard));

                            // FIXME: Reload specific content instead of everything
                            JSONED.refresh();

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
    const files = e.dataTransfer?.files;
    if (!files) return;
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
            // 1. This is a static website. There is no server being queried for html content.
            // 2. It is off by default, and the user must explicitly turn it on.
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