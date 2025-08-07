import React from "react";

// import { decode } from "messagepack";
import { Ace } from "./component/ace";

import { genTree, refresh } from "./component/jstree";
import jquery from "jquery"; // Necessary ONLY for jstree
import { get, keys, values } from "./editor/wrapper";
import { savecount } from "./params";
import { JSONED } from "./editor/global";
import { UNDO_TREE_LENGTH, autorun, fixBarry, queueSave } from ".";

const numsaves = globalThis.offline ? 20 : savecount;

export const PROJECT = {
    project: "" as any,
    data: {} as any,

    parent: {} as any,
    active: "",
    type: "",

    aid: "",

    tree: null as any,
    handleImport: null as (files: FileList, target?: HTMLInputElement) => void,
    showSnack: null as (message: string, severity?: string) => void,

    changeTrees: {} as any,
    changeTree: null as ChangeTree,
};
globalThis.PROJECT = PROJECT;

export class ChangeTree {
    curState: string;
    undoTree: string[];
    redoTree: string[];

    constructor(data) {
        this.curState = JSON.stringify(data);
        this.undoTree = [];
        this.redoTree = [];
    }

    clear() {
        this.undoTree = [];
        this.redoTree = [];
    }

    record() {
        if (this.redoTree.length > 0) this.redoTree = [];
        const nstate = JSON.stringify(PROJECT.parent[PROJECT.active]);
        if (this.curState != nstate) {
            this.undoTree.push(this.curState);
            this.curState = nstate;
            if (this.undoTree.length > UNDO_TREE_LENGTH) this.undoTree.shift();
        }
    }

    undo() {
        const u = this.undoTree.pop();
        if (!u) return;
        this.redoTree.push(this.curState);
        this.curState = u;
        PROJECT.parent[PROJECT.active] = JSON.parse(u);

        JSONED.refresh();
        window["ace_rawr"].setValue(JSON.stringify(PROJECT.parent[PROJECT.active], null, 4), -1);
        queueSave();
    }

    redo() {
        const u = this.redoTree.pop();
        if (!u) return;
        this.undoTree.push(this.curState);
        this.curState = u;
        PROJECT.parent[PROJECT.active] = JSON.parse(u);

        JSONED.refresh();
        window["ace_rawr"].setValue(JSON.stringify(PROJECT.parent[PROJECT.active], null, 4), -1);
        queueSave();
    }
}

export function save() {
    console.log("Saving!");
    localStorage.setItem("ocsd-" + PROJECT.project, JSON.stringify(PROJECT.data));
    updatePRaw();
    updateUsedSize();
}
export function updatePRaw() {
    function isEmptyFolder(v) {
        if (typeof v != "object") return false;
        if (keys(v).length == 0) return true;
        for (const iv of values(v)) if (!isEmptyFolder(iv)) return false;
        return true;
    }
    const replacer = (_, v) => isEmptyFolder(v) ? undefined : v;

    window["ace_praw"]?.setValue(JSON.stringify(
        PROJECT.data,
        (document.querySelector("#hide-empty-folders") as HTMLInputElement).checked ? replacer : null,
        4
    ), -1);
}

export function updateUsedSize() {
    let size = 0;
    // if (globalThis.offline) {
    //     for (const [key, value] of Object.entries(localStorage.getAll())) {
    //         console.log(key, value);
    //         size += new Blob([key]).size + new Blob([value as any]).size;
    //     }
    // } else {
    //     for (let i = 0; i < localStorage.length; i++) {
    //         const key = localStorage.key(i);
    //         size += new Blob([key]).size + new Blob([localStorage.getItem(key)]).size;
    //     }
    // }
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        size += new Blob([key]).size + new Blob([localStorage.getItem(key)]).size;
    }

    const spuElem = document.querySelector("#spaceused");
    const maxSize = globalThis.offline ? 10 : 5; // In MB
    if (size > 102400) {
        // If bigger than 100 KB, display in Megabytes
        size = Math.floor(size / 1024000 * 100) / 100;
        const percent = Math.floor(size / maxSize * 10000) / 100;
        spuElem.textContent = `${size}MB/${maxSize}MB ${percent}%`;

        if (!globalThis.offline && !(document.querySelector('#disable-file-limit') as HTMLInputElement).checked && percent >= 90) {
            PROJECT.showSnack(`Warning! localStorage is ${percent}% full (${size}MB)! Either free up space or increase localStorage!`, "warning");
        }
    } else {
        // Otherwise, display in Kilobytes
        size = Math.floor(100 * size / 1024) / 100;
        const percent = Math.floor(size / (maxSize * 1024) * 10000) / 100;
        spuElem.textContent = `${size}KB/${maxSize}MB ${percent}%`;
    }
}

export function updateName() {
    const name = get(PROJECT.data?.meta, "name")?.trim();
    if (name) document.querySelector("h6").textContent = name;
    else document.querySelector("h6").innerHTML = "&nbsp;";

    let names = JSON.parse(localStorage.getItem("ocn")) ?? {};
    names[PROJECT.project] = name;
    localStorage.setItem("ocn", JSON.stringify(names));

    const option = document.querySelector(`#psel option[value="${PROJECT.project}"]`);
    if (option) option.textContent = name;
}

// function convert(data: any, inFile: boolean = false) {
//     for (const [k, v] of Object.entries(data as {[k: string]: any})) {
//         if (typeof v == "object") {
//             if (inFile) {
//                 convert(v, true);
//                 if (k == "o__") {
//                     Object.assign(data, v);
//                     delete data.o__;
//                 }
//             } else {
//                 convert(v, !k.endsWith("/"));
//             }
//         }
//     }
// }

async function loadProject(key: string) {
    if (localStorage.getItem("oc-"+key) != null) {
        // // If old project data exists, import it so it's not lost!
        // // PROJECT.data = JSON.parse(localStorage.getItem("origin-creator-data"));
        // // delete PROJECT.data.$;
        // // convert(PROJECT.data);

        // // save();
        // // localStorage.removeItem("origin-creator-data");

        // // Update data
        // const compressed = localStorage.getItem("oc-" + key);
        // PROJECT.data = decode(decodeStorageBinaryString(compressed));

        // PROJECT.project = key ?? "";
        // save();
        // localStorage.removeItem("oc-" + key);
        PROJECT.showSnack("Failed to load project data; too old. Ask mathgeniuszach for help in the Discord.");
    } else {
        const data = localStorage.getItem("ocsd-" + key);
        if (!data) {
            PROJECT.data = {
                meta: {
                    name: "Pack " + (parseInt(key) + 1),
                    id: "my_pack",
                    pack_format: 6
                }
            };
        } else {
            PROJECT.data = JSON.parse(localStorage.getItem("ocsd-" + key));
        }
    }

    PROJECT.project = key ?? "";
    PROJECT.parent = {};
    PROJECT.active = "";

    PROJECT.changeTrees = {};
    PROJECT.changeTree = null;

    updatePRaw();
    updateName();

    // Create / Update the sidebar
    refreshTree();
}

export function refreshTree() {
    const tree = jquery("#filetree").jstree(true);
    tree.deselect_all(true);

    tree.settings.core.data = genTree(PROJECT.data);
    tree.refresh();
}

export function Projects(props) {
    const ocn = localStorage.getItem("ocn");
    let pnames: {[key: string]: any} | string[] = ocn ? JSON.parse(ocn) : {};
    if (Array.isArray(pnames)) {
        // if pnames is an array, we need to convert it to a dictionary instead.
        const ns = {};
        pnames.forEach((v, i) => ns[i] = v);
        pnames = ns;

        localStorage.setItem("ocn", JSON.stringify(pnames));
    }

    const slot = localStorage.getItem("ocs") ?? "0";
    loadProject(slot);

    const opts = [];
    for (let i = 0; i < numsaves; i++) {
        opts.push(<option key={i} value={i}>
            {pnames[i] ?? "Pack " + (i+1)}
        </option>);
    }

    // Export warnings are disabled in offline packs
    const DisableFileLimit = globalThis.offline ? <></> : <>
        <input type="checkbox" id="disable-file-limit" onChange={
            (e) => {if (e.target.checked) localStorage.setItem("ocdfl", "1"); else localStorage.removeItem("ocdfl");}
        }/>
        <label htmlFor="disable-file-limit">Disable File Limit</label>
    </>;
    const LocalStorageWarning = globalThis.offline ? <>
        <p>(Note: keep filesize low or program may slow down)</p>
    </> : <>
        <p>(Warning! Do not go above the <a href="/response/local-storage" target="_blank">localStorage limit!</a>)</p>
    </>;

    return (<>
        <h3 id="spaceused"></h3>
        <div className="btn-group">
            {DisableFileLimit}
            <input type="checkbox" id="disable-export-warnings" onChange={
                (e) => {if (e.target.checked) localStorage.setItem("ocdew", "1"); else localStorage.removeItem("ocdew");}
            }/>
            <label htmlFor="disable-export-warnings">Disable Export Warnings</label>
            <input type="checkbox" id="disable-undo-redo" onChange={
                (e) => {if (e.target.checked) localStorage.setItem("ocdur", "1"); else localStorage.removeItem("ocdur");}
            }/>
            <label htmlFor="disable-undo-redo">Disable Undo/Redo</label>
        </div>
        {LocalStorageWarning}
        <h3>Save Slots:</h3>
        <div id="psel" className="panel">
            <select size={Math.min(numsaves, 10)} defaultValue={slot} onChange={(e) => {
                localStorage.setItem("ocs", e.target.value);
                loadProject(e.target.value);
            }}>
                {opts}
            </select>
        </div>
        <h3>Slot Raw:</h3>
        <div className="btn-group">
            <input type="checkbox" id="hide-empty-folders" onChange={() => updatePRaw()}/>
            <label htmlFor="hide-empty-folders">Hide Empty Objects</label>
        </div>
        <div className="btn-group">
            <button onClick={async () => {
                try {
                    PROJECT.data = JSON.parse(await navigator.clipboard.readText());
                    fixBarry();
                    save();
                    refresh();
                    alert("Import Successful");
                } catch (err) {
                    alert("Import Failed; " + err);
                }
            }}>Import from Clipboard</button>
            <button onClick={() => {
                navigator.clipboard.writeText(window["ace_praw"]?.getValue());
                alert("Copied to clipboard");
            }}>Copy to Clipboard</button>
            <button onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(JSON.parse(window["ace_praw"]?.getValue())));
                alert("Copied to clipboard");
            }}>Copy to Clipboard (Minified)</button>
        </div>
        <Ace name="praw" mode="json" height="400px" readonly value={JSON.stringify(PROJECT.data, null, 4)}/>

        <h3>Autorun:</h3>
        <div className="btn-group">
            <input type="checkbox" id="enable-autorun" onChange={
                (e) => {if (e.target.checked) localStorage.setItem("oceor", "1"); else {localStorage.removeItem("oceor"); autorun();}}
            }/>
            <label htmlFor="enable-autorun">Enable</label>
        </div>
        <div className="btn-group">
            <button onClick={autorun}>Save & Re-run</button>
            <span>(Only run code here from people you trust!)</span>
        </div>
        <Ace name="macros" mode="javascript" height="400px"/>
    </>);
}

// Screw react
export function setProjectSettings() {
    // In offline mode, there's no need for export warnings.
    if (globalThis.offline) localStorage.setItem("ocdfl", "1");

    if (localStorage.getItem("ocdfl") != null && !globalThis.offline) (document.getElementById("disable-file-limit") as HTMLInputElement).checked = true;

    if (localStorage.getItem("ocdew") != null) (document.getElementById("disable-export-warnings") as HTMLInputElement).checked = true;
    if (localStorage.getItem("ocdur") != null) (document.getElementById("disable-undo-redo") as HTMLInputElement).checked = true;
    if (localStorage.getItem("oceor") != null) (document.getElementById("enable-autorun") as HTMLInputElement).checked = true;
}