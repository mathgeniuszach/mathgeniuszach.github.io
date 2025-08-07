import { snakeCase, startCase } from "lodash";
import { IMAGE_FILES, KNOWN_FILES, update } from "..";
import { getTree, getNode, getNodeParents, isFile, refresh, getNodeFromPath, deleteNode } from "../component/jstree";
import { PROJECT } from "../projects";
import { JSONED } from "./global";
import { get, set, simplify } from "./wrapper";

type OCFileType = "folder" | "binary" | "text" | "json" | "none";

function getFileData(path: string): any {
    if (!path) return undefined;

    let data = PROJECT.data;

    for (const f of path.split(/(?<=\/)/g)) {
        if (!(f in data)) return undefined;
        data = data[f];
    }

    if (path.endsWith("/")) return null;
    return simplify(data);
}
function setFileData(path: string, data: any = null) {
    let loc = PROJECT.data;
    let ctree = PROJECT.changeTrees;
    let fs = path.split(/(?<=\/)/g);
    let key = fs.pop();

    if (data && key.endsWith("/")) throw Error(`Cannot write data to folder "${path}"`);

    let needsRefresh = false;

    for (const f of fs) {
        if (!(f in loc)) {
            loc[f] = {};
            needsRefresh = true;
        }
        if (ctree) ctree = ctree[f];
        loc = loc[f];
    }

    if (!(key in loc)) needsRefresh = true;

    if (data) {
        loc[key] = data;
    } else {
        if (key.endsWith("/")) loc[key] = {};
        else loc[key] = "";
    }

    if (ctree && key in ctree && !key.endsWith("/")) ctree[key].clear();

    if (needsRefresh) refresh();
    update();

    if (loc == PROJECT.parent && key == PROJECT.active) JSONED.refresh();
}

function deleteFileData(path: string) {
    const data = getFileData(path);
    if (data === undefined) throw Error(`Cannot delete non-existant ${path.endsWith("/") ? "file" : "folder"} "${path}"`);

    let node = getNodeFromPath(path);

    if (node) deleteNode(node);
}

function listPathsRecurse(data: any, path: string, out: string[]) {
    for (const [k, v] of Object.entries(data)) {
        const p = path + k;
        out.push(p);
        if (k.endsWith("/")) listPathsRecurse(v, p, out);
    }
}

function listPaths(data: any, path: string, recursive: boolean = false, filter: (path: string, data?: any) => boolean = null): string[] {
    const out = [];
    if (recursive) {
        for (const [k, v] of Object.entries(data)) {
            const p = path + k;
            out.push(p);
            if (k.endsWith("/")) listPathsRecurse(v, p, out);
        }
    } else {
        for (const k of Object.keys(data)) {
            out.push(path + k);
        }
    }
    return filter ? out.filter(filter) : out;
}

function listAndReadDataRecurse(data: any, path: string, out: [string, any][]) {
    for (const [k, v] of Object.entries(data)) {
        const p = path + k;
        if (k.endsWith("/")) listAndReadDataRecurse(v, p, out);
        else out.push([p, simplify(v)]);
    }
}

function listAndReadData(data: any, path: string, recursive: boolean = false, filter: (path: string, data?: any) => boolean = null) {
    const out: [string, any][] = [];
    if (recursive) {
        for (const [k, v] of Object.entries(data)) {
            const p = path + k;
            if (k.endsWith("/")) listAndReadDataRecurse(v, p, out);
            else out.push([p, simplify(v)]);
        }
    } else {
        for (const [k, v] of Object.entries(data)) {
            if (!k.endsWith("/")) out.push([path + k, simplify(v)]);
        }
    }
    return filter ? out.filter((v) => filter(v[0], v[1])) : out;
}

function getActive(): string | null {
    const tree = getTree();
    const sel = tree?.get_selected();
    if (!sel?.length) return null;

    const node = getNode(sel[0]);
    const parents = getNodeParents(node);

    return parents.slice(1).map(n => tree.get_text(n) + "/").join("") + node.text;
}

function setActive(path: string) {
    const data = getFileData(path);
    if (data === null || path.endsWith("/")) throw Error(`Cannot activate folder "${path}"`);
    else if (data === undefined) throw Error(`Cannot activate non-existant file "${path}"`);

    let node = getNodeFromPath(path);

    if (node) getTree()?.activate_node(node.id);
}

export const oc = {
    macros: {} as any,

    get id(): string {
        return get(PROJECT.data.meta, "id");
    },
    set id(v: string) {
        set(PROJECT.data.meta, "id", v);
        update();
    },

    get active(): string | null {
        return getActive();
    },
    set active(path: string) {
        setActive(path);
    },

    clean() {
        oc.macros = {};
    },

    print(message: string, severity: string = "info") {
        PROJECT.showSnack(message, severity);
    },
    macro(key: string, f: () => void = null) {
        if (f) {
            if (key in oc.macros) throw Error(`Macro already assigned to "${key}"`);
            oc.macros[key] = f;
        } else {
            delete oc.macros[key];
        }
    },

    isFile(path: string): boolean {
        return !path.endsWith("/");
    },
    isFolder(path: string): boolean {
        return path.endsWith("/");
    },

    locatePath(type: string, id: string): string {
        // console.log(type, id);
        let data = PROJECT.data;

        // Determine top level type folders
        let t = snakeCase(type.trim());
        if (t.endsWith("s")) t = t.substring(0, t.length-1);
        if (t == "meta") return "meta";

        if (t.endsWith("_tag")) {
            data = data["tags/"];
            t = t.substring(0, t.length-4);
            if (!t.endsWith("s") && !(data && t+"/" in data)) t += "s";
            t += "/";
            if (data) data = data[t];
            t = "tags/" + t;
        } else if (t == "tag") {
            data = data["tags/"];
            t = "tags/";
        } else if (t == "asset" || t == "texture") {
            data = data["assets/"];
            t = "assets/";
        } else {
            if (t+"/" in data) {
                t += "/";
            } else {
                t += "s/";
            }
            data = data[t];
        }

        // Now determine namespace....
        let n = "0";
        let p = id;
        if (p.includes(":")) {
            const nloc = p.indexOf(":");
            n = p.substring(0, nloc);
            p = p.substring(nloc+1);
        }

        // And lower level folders...
        const folders = p.split("/");
        p = folders.pop();

        for (const f of folders) {
            if (data) data = data[f+"/"];
        }
        if (folders.length > 0) {
            folders.push("");
        }

        // Check namespace against a few files
        const pid = oc.id;
        if (n == "0" || n == pid) {
            if (!data || p in data) n = "";
            else if (("0:" + p) in data) n = "0";
            else if ((pid+":" + p) in data) n = pid;
            else n = "";
        }

        // Put it all together
        return t + (n ? n + ":" : "") + folders.join("/") + p;
    },
    getTypedID(path: string, universal: boolean = false): [string, string] {
        if (path == "meta") return ["meta", "meta"];

        if (path.endsWith("/")) throw Error(`Cannot get typed ID of folder "${path}"`);
        const ptexts = path.split("/");
        const item = ptexts.pop();

        let ftype = ptexts[0];
        if (ftype == "assets") {
            if (ptexts.length > 1) {
                ftype = ptexts[1];
            } else {
                const extLoc = item.indexOf(".");
                if (extLoc >= 0 && IMAGE_FILES.includes(item.substring(extLoc))) {
                    ftype = "textures";
                }
            }
        } else if (ftype == "tags") {
            ptexts.shift();
            if (ptexts.length > 0) {
                let itype = ptexts[0];
                if (itype.endsWith("s")) itype = itype.substring(0, itype.length-1);
                ftype = itype + "_" + ftype;
            }
        } else if (!ftype) {
            ptexts.push(""); // To fix the shift
            ftype = "unknown";
        }

        if (ftype?.endsWith("s")) ftype = ftype.substring(0, ftype.length-1);

        ptexts.shift();
        ptexts.push(""); // Adds a slash to the end of a folder path

        let id;
        if (item.includes(":")) {
            const nsl = item.indexOf(":") + 1;
            let ns = item.substring(0, nsl);
            if (universal && ns == "0:") ns = oc.id + ":";
            id = ns + ptexts.join("/") + item.substring(nsl);
        } else {
            id = (universal ? oc.id + ":" : "0:") + ptexts.join("/") + item;
        }

        return [ftype, id];
    },

    getFormat(path: string): OCFileType {
        const data = getFileData(path);
        if (data === undefined) {
            return "none";
        } else if (data === null) {
            return "folder";
        } else if (typeof(data) == "string") {
            if (data.startsWith("\0RAW ")) return "binary";
            return "text";
        } else {
            return "json";
        }
    },

    exists(path: string): any {
        return getFileData(path) !== undefined;
    },
    read(path: string): any {
        let data = getFileData(path);

        // if (parse_raw && typeof data == "string" && data.startsWith("\0RAW ")) {
        //     data = atob(data.substring(5));
        //     const buf = new Uint8Array(data.length);
        //     for (let i = 0; i < data.length; ++i) {
        //         buf[i] = data.charCodeAt(i);
        //     }
        //     data = buf;
        // }

        return data;
    },
    write(path: string, data: any = null) {
        setFileData(path, data);
    },
    delete(path: string): boolean {
        try {
            deleteFileData(path);
            return true;
        } catch (err) {
            return false;
        }
    },
    list(path?: string, recursive: boolean = false, filter: (path: string) => boolean = null): string[] {
        if (path && !path.endsWith("/")) throw Error(`Cannot list over file "${path}"`);

        let data = PROJECT.data;
        if (path) {
            for (const f of path.split(/(?<=\/)/g)) {
                if (!(f in data)) return [];
                data = data[f];
            }
        }

        return listPaths(data, path || "", recursive, filter);
    },
    listFiles(path?: string): string[] {
        return oc.list(path, true, oc.isFile);
    },
    listAndRead(path?: string, recursive: boolean = false, filter: (path: string) => boolean = null): [string, any][] {
        if (path && !path.endsWith("/")) throw Error(`Cannot list over file "${path}"`);

        let data = PROJECT.data;
        if (path) {
            for (const f of path.split(/(?<=\/)/g)) {
                if (!(f in data)) return [];
                data = data[f];
            }
        }

        return listAndReadData(data, path || "", recursive, filter);
    },

    snakeCase,
    startCase
};

globalThis.oc = oc;