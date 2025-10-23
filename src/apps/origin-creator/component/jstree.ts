import jquery from "jquery"; // Necessary ONLY for jstree
import "jstree";

import { $, loadEditor, viewSection } from "..";
import { ChangeTree, PROJECT, save } from "../projects";
import { get, simplify } from "../editor/wrapper";
import { oc } from "../editor/api";
import { startCase } from "lodash";
import { JSONED } from "../editor/global";

let tree;
let edited = null;
let rename_lock = false;
let sort_icons = [];

export function getTree(): any {
    return tree;
}

export function getNodeFromPath(path: string): any {
    let node = getNode("#");
    for (const f of path.split(/(?<=\/)/g)) {
        const isFolder = f.endsWith("/");
        const name = isFolder ? f.substring(0, f.length-1) : f;

        const nnode = node;
        node = null;
        for (const nt of nnode.children) {
            const n = getNode(nt);
            if (n.text != name) continue;
            if (isFolder == isFile(n)) continue;
            node = n;
        }
        if (!node) break;
    }

    return node;
}
export function getNodePath(node): string | null {
    const parents = getNodeParents(node);
    if (!parents || parents.length <= 0) return null;

    const path: string[] = [];
    for (const parent of parents.slice(1)) {
        path.push(getNode(parent).text);
    }
    path.push(getNode(node).text);

    return path.join("/");
}

export function getNode(node): any {
    return typeof node == "string" ? jquery("#filetree").jstree().get_node(node) : node;
}
export function getNodeParents(node): any[] {
    if (!node.parents) return [];

    const parents = Object.assign([], node.parents);
    if (parents[0] != "#") parents.reverse();
    return parents;
}
export function getNodeData(node, parent: boolean = false): any {
    const tnode = getNode(node);
    const parents = getNodeParents(tnode);

    if (!parents || parents.length <= 0) return PROJECT.data;

    let loc = PROJECT.data;
    for (const parent of parents.slice(1)) {
        loc = loc[tree.get_node(parent).text+"/"];
    }

    if (parent) {
        return loc;
    } else {
        return loc[tnode.text + (isFile(node) ? "" : "/")];
    }
}
export function getNodeChangeTree(node, parent: boolean = false, make: boolean = false): any {
    if (localStorage.getItem("ocdur") != null) return null;

    const tnode = getNode(node);
    const parents = getNodeParents(tnode);

    if (!parents || parents.length <= 0) return PROJECT.changeTrees;

    let loc: {[k: string]: ChangeTree} | ChangeTree = PROJECT.changeTrees;
    for (const parent of parents.slice(1)) {
        const key = tree.get_node(parent).text+"/";
        if (!(key in loc)) {
            if (make) loc[key] = {};
            else return null;
        }
        loc = loc[key];
    }

    if (parent) {
        return loc;
    } else {
        const file = isFile(node);
        const key = tnode.text + (file ? "" : "/");
        if (!(key in loc)) {
            if (make) {
                loc[key] = file ? new ChangeTree(PROJECT.parent[PROJECT.active]) : {};
            } else return null;
        }
        return loc[key];
    }
}
export function fixName(node, pdata, rname?: string): string {
    const tnode = getNode(node);

    // Do first cleaning of name
    let name = (rname ?? tnode.text).toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9:._-]+/g, "");
    if (!name) name = "item";

    // Ensure that name is unique
    if (isFile(node)) {
        // Split extension off
        const extloc = name.indexOf(".");
        let ext   = extloc == -1 ? ""   : name.substring(extloc);
        name      = extloc == -1 ? name : name.substring(0, extloc);

        // Do the ensuring
        while (name in pdata || name+ext in pdata) name += "_";
        name += ext;
    } else {
        // Do the ensuring
        while (name+"/" in pdata) name += "_";

        // If a root item needs a type, give it one
        const icons = JSONED.getCurrentSchema().items.icons;
        if (pdata == PROJECT.data && name in icons) {
            tree.set_type(tnode, icons[name]);
        }
    }

    // Give node new name
    rename_lock = true;
    tree.rename_node(tnode, name);
    return name;
}

export function getFileHeading(node, nodeText = null): string {
    const parents = getNodeParents(node);
    if (!parents || parents.length <= 0) return "root";

    const [ftype, id] = oc.getTypedID(
        parents.slice(1).map(n => tree.get_text(n) + "/").join("") + (nodeText || node.text)
    );

    const pid = oc.id;
    const oid = id.replace("0:", pid + ":");
    const sid = id.replace(pid + ":", "0:");

    if (oid == sid) {
        return `(${startCase(ftype)}) ${oid}`;
    } else {
        return `(${startCase(ftype)}) ${oid} (${sid})`;
    }
}

export function isFile(node) {
    const tnode = getNode(node);
    return tnode.type == "file" || tnode.type == "meta";
}
function isFree(node) {
    const tnode = getNode(node);
    return tnode.parent != "#" || tnode.type == "file";
}

export function newFolder(node) {
    // Create new node
    const nnode = tree.create_node(node, {text: "-$$_TEMP_$$-"});
    // Edit new node
    edited = nnode;
    rename_lock = true;
    tree.edit(nnode, "folder", (inode, status, cancel) => {
        if (cancel) {
            tree.delete_node(nnode);
            return;
        }

        const parent = getNodeData(inode, true);

        parent[fixName(inode, parent)+"/"] = {};
        edited = null;
        save();
    });
}

let tclipboard = localStorage.getItem("ocfc");
export function cutNode(node) {
    const tnode = getNode(node);
    if (isFree(tnode)) {
        // Copy to clipboard
        tclipboard = JSON.stringify([tnode.text + (isFile(tnode) ? "" : "/"), getNodeData(tnode)]);
        localStorage.setItem("ocfc", tclipboard);

        // Delete node
        deleteNode(node);
    }
}
export function copyNode(node) {
    const tnode = getNode(node);
    if (isFree(tnode)) {
        // Copy to clipboard
        tclipboard = JSON.stringify([tnode.text + (isFile(tnode) ? "" : "/"), getNodeData(tnode)]);
        localStorage.setItem("ocfc", tclipboard);
        // Visual Feedback
        if (typeof node == "string") ($(`#${node} > .jstree-anchor`) as HTMLElement)?.blur();
    }
}
export function pasteNode(node) {
    if (tclipboard) {
        const tnode = getNode(node);
        if (!isFile(tnode)) {
            // Paste
            const parent = getNodeData(tnode);
            const out = JSON.parse(tclipboard);

            const folder = out[0].endsWith("/");

            const nnode = tree.create_node(tnode, {text: "-$$_TEMP_$$-", type: folder ? "default" : "file"});
            parent[fixName(nnode, parent, out[0]) + (folder ? "/" : "")] = out[1];
            save();

            // Reload tree
            refreshTree();
        }
    }
}
export function cloneNode(node) {
    const tnode = getNode(node);
    if (!tnode.parents || tnode.parents[0] == "#") return;
    const data = simplify(getNodeData(tnode)); // Simplify also works as a cloning mechanism

    const pnode = getNode(tnode.parents[0]);
    const pdata = getNodeData(pnode);

    const nnode = tree.create_node(pnode, {text: "-$$_TEMP_$$-", type: tnode.type});
    pdata[fixName(nnode, pdata, tnode.text) + (isFile(tnode) ? "" : "/")] = data;
    save();

    // Reload tree
    refreshTree();
}

export function deleteNode(node) {
    const tnode = getNode(node);
    if (tnode.id !== edited && tnode.type != "meta") {
        // Deselect node if self or parent deleted
        const p: any = [];
        for (const n of tree.get_selected()) {
            p.push(n);
            p.push(...getNodeParents(getNode(n)));
        }
        if (p.includes(tnode.id)) {
            PROJECT.active = "";
            viewSection("projects");
        }

        // Delete change tree
        const ctree = getNodeChangeTree(tnode, true, false);
        if (ctree) delete ctree[tnode.text + (isFile(tnode) ? "" : "/")];

        // Delete data
        const parent = getNodeData(tnode, true);
        delete parent[tnode.text + (isFile(tnode) ? "" : "/")];
        save();

        // Delete node
        tree.delete_node(tnode);
    }
}

export function genTree(data: any, root: boolean = true, icons: {[k: string]: string} = {}): any {
    const out: any[] = [];
    for (const [k, v] of Object.entries(data)) {
        const folder = k.charAt(k.length-1) == "/";
        let name = folder ? k.slice(0, -1) : k;

        let type: any = folder ? undefined : "file";
        if (root && folder && name in icons) type = icons[name];

        const obj: any = {
            text: name,
            type: type
        };
        if (folder) obj.children = genTree(v, false, icons);
        out.push(obj);
    }
    return out;
}
export function refreshTree() {
    const sel = oc.active;

    const icons = JSONED.getCurrentSchema().items.icons;
    sort_icons = Object.values(icons);
    tree.deselect_all(true);
    tree.settings.core.data = genTree(PROJECT.data, true, icons);
    tree.refresh();
    
    try {
        oc.active = sel;
    } catch (err) {}
}

export function makeTree(elem: string) {
    let unmove = false;

    const ftree = jquery(elem);
    ftree.jstree({
        core: {
            themes: {
                name: "proton",
                variant: "small",
                responsive: false
            },
            force_text: true,
            multiple: false,
            check_callback: (operation, node) => {
                return unmove && operation == "move_node" || isFree(node) || operation == "delete_node" && node.type != "meta";
            }
        },
        types: {
            file: {icon: "i/file.png", max_depth: 0},
            meta: {icon: "i/file.png", max_depth: 0},
            origin_layers: {icon: "i/layer.png"},
            origins: {icon: "i/origin.png"},
            powers: {icon: "i/power.png"},
            tags: {icon: "i/tag.png"},
            functions: {icon: "i/function.png"},
            predicates: {icon: "i/predicate.png"},
            advancements: {icon: "i/advancement.png"},
            recipes: {icon: "i/recipe.png"},
            loot_tables: {icon: "i/loot_table.png"},
            item_modifiers: {icon: "i/item_modifier.png"},
            assets: {icon: "i/assets.png"},
            scripts: {icon: "i/script.png"}
        },
        conditionalselect: (node) => isFile(node) && node.id !== edited,
        dnd: {
            is_draggable: (node) => isFree(node[0]),
            large_drop_target: true,
            copy: false,
            use_html5: true
        },
        sort: (a, b) => {
            const na = getNode(a);
            const nb = getNode(b);

            const fa = isFree(na);
            const fb = isFree(nb);
            if (fa) {
                if (fb) {
                    // Two unlocked elements
                    const fa = isFile(na);
                    const fb = isFile(nb);

                    if (fa == fb) {
                        // If both are files or folders sort alphabetically
                        return na.text.localeCompare(nb.text);
                    } else {
                        // Folders go before files
                        return fa ? 1 : -1;
                    }
                } else {
                    // b is locked and comes before unlocked a
                    return 1;
                }
            } else {
                if (fb) {
                    // a is locked and comes before unlocked b
                    return -1;
                } else {
                    // both are locked, so return whatever is first in sort_icons.
                    let ia = sort_icons.indexOf(na.type);
                    let ib = sort_icons.indexOf(nb.type);
                    // folders without an icon are sorted by name after folders with icons.
                    if (ia < 0 && ib < 0) return na.name.localeCompare(nb.name);
                    if (ia < 0) ia = Infinity;
                    if (ib < 0) ib = Infinity;

                    return Math.sign(ia-ib);
                }
            }
        },
        contextmenu: {
            items: (node) => ({
                newfile: {
                    label: "New File",
                    _disabled: () => isFile(node),
                    action: () => {
                        // Create new node
                        const nnode = tree.create_node(node);
                        tree.set_type(nnode, "file");
                        // Edit new node
                        edited = nnode;
                        rename_lock = true;
                        tree.edit(nnode, "file", (inode, status, cancel) => {
                            if (cancel) {
                                tree.delete_node(nnode);
                                return;
                            }

                            const parent = getNodeData(inode, true);
                            parent[fixName(inode, parent)] = "";
                            edited = null;
                            save();
                        });
                    }
                },
                newfolder: {
                    label: "New Folder",
                    _disabled: () => isFile(node),
                    action: () => newFolder(node)
                },
                cut: {
                    separator_before: true,
                    label: "Cut",
                    _disabled: () => !isFree(node),
                    action: () => cutNode(node)
                },
                copy: {
                    label: "Copy",
                    _disabled: () => !isFree(node),
                    action: () => copyNode(node)
                },
                paste: {
                    label: "Paste",
                    _disabled: () => isFile(node) || !tclipboard,
                    action: () => pasteNode(node)
                },
                duplicate: {
                    label: "Duplicate",
                    _disabled: () => getNode(node).parents[0] == "#",
                    action: () => cloneNode(node)
                },
                rename: {
                    separator_before: true,
                    label: "Rename",
                    _disabled: () => !isFree(node),
                    action: () => tree.edit(node, node.text)
                },
                delete: {
                    label: "Delete",
                    _disabled: () => getNode(node).type == "meta",
                    action: () => deleteNode(node)
                },
            })
        },
        plugins: ["themes", "types", "conditionalselect", "dnd", "sort", "contextmenu"]
    });

    // Handle events
    ftree.on("select_node.jstree", (e, data) => {
        const node = data.node;
        if (!isFile(node) || node.id === edited) { // In case JSTree selects something it shouldn't
            tree.deselect_all(true);
            return;
        }

        if (node.type == "meta") {
            PROJECT.parent = PROJECT.data;
            PROJECT.active = "meta";
            loadEditor("meta", "Project Metadata");
        } else {
            PROJECT.parent = getNodeData(node, true);
            PROJECT.active = node.text;
            const path = getNodePath(node);
            if (!path) return;
            loadEditor(path, getFileHeading(node));
        }
    });

    ftree.on("rename_node.jstree", (_, data) => {
        if (rename_lock) {
            rename_lock = false;
            return;
        }

        const node = data.node;
        if (!isFree(node)) {
            rename_lock = true;
            tree.rename_node(node, data.old);
            return;
        }

        const parent = getNodeData(node, true);

        const ntext = data.text.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9:._-]+/g, "");

        if (data.old !== ntext) {
            // Get new name
            rename_lock = true;
            const name = fixName(node, parent);

            // Delete old data
            const ctree = getNodeChangeTree(node, true);
            if (isFile(node)) {
                parent[name] = parent[data.old];
                delete parent[data.old];
                if (ctree && data.old in ctree) {
                    ctree[name] = ctree[data.old];
                    delete ctree[data.old];
                }
            } else {
                parent[name+"/"] = parent[data.old+"/"];
                delete parent[data.old+"/"];
                if (ctree && data.old in ctree) {
                    ctree[name] = ctree[data.old];
                    delete ctree[data.old];
                }
            }

            // If the currently selected item is in the path, update the heading
            const p: any[] = [];
            const sel = tree.get_selected();
            for (const n of sel) {
                p.push(n);
                p.push(...getNodeParents(getNode(n)));
            }
            if (p.includes(node.id)) {
                PROJECT.active = name;
                const h2 = $("h2");
                if (h2) h2.textContent = getFileHeading(getNode(sel[0]));
            }

            save();
        } else if (data.text !== ntext) {
            rename_lock = true;
            tree.rename_node(node, data.old);
        }
    });

    ftree.on("move_node.jstree", (_, data) => {
        if (unmove) {
            unmove = false;
            return;
        }

        if (data.parent != data.old_parent) {
            // Get node locations and names
            let oldLoc = getNodeData(data.old_parent);
            let newLoc = getNodeData(data.parent);
            if (!newLoc) {
                // If the new location is at the root, don't let the move occur
                unmove = true;
                tree.move_node(data.node.id, data.old_parent);
                return;
            }

            const end = (data.node.type == "default" ? "/" : "");
            let newName = fixName(data.node, newLoc) + end;
            let oldName = data.node.text + end;

            // Move change trees
            let oldCtree = getNodeChangeTree(data.old_parent);
            if (oldCtree && oldName in oldCtree) {
                let newCtree = getNodeChangeTree(data.parent, false, true);
                newCtree[newName] = oldCtree[oldName];
                delete oldCtree[oldName];
            }

            // Move data
            newLoc[newName] = oldLoc[oldName];
            delete oldLoc[oldName];

            // Reselect self or child node if necessary (to reload it, because it's type may have changed)
            const p: any[] = [];
            const sel = tree.get_selected();
            for (const n of sel) {
                p.push(n);
                p.push(...getNodeParents(getNode(n)));
            }
            if (p.includes(data.node.id)) {
                tree.deselect_all(true);
                tree.activate_node(getNode(sel[0]));
            }

            save();
        }
    });

    // Return tree
    tree = ftree.jstree(true);
    PROJECT.tree = tree;
    return tree;
}