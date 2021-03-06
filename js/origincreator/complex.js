function getParents(node) {
    var parents = [];
    if (!node.parents) return null;

    Object.assign(parents, node.parents);
    if (parents[0] != "#") parents.reverse();
    return parents;
}
function isFreeNode(node) {
    return node.type == "default" || node.type == "file";
}
function isFile(node) {
    return node.type == "file" || node.type == "meta";
}
function findNodeData(node, parentData) {
    var tnode = node;
    if (typeof(node) == "string") {
        if (node == "#") return data;
        tnode = contentBox.get_node(node);
    }

    var parents = getParents(tnode);
    var loc = data;
    if (!parents) return loc;

    for (let i = 1; i < parents.length; i++) {
        loc = loc[contentBox.get_node(parents[i]).text+"/"];
    }

    if (parentData) {
        return loc;
    } else {
        if (isFile(node)) return loc[tnode.text];
        else return loc[tnode.text+"/"];
    }
}

function ss(str) {
    "use strict";
    return str.replace(/\s+/g, '_').replace(/[^\w:._]+/g, '').toLowerCase();
}
function fixName(node, d) {
    var tnode = node;
    if (typeof(node) == "string") tnode = contentBox.get_node(node);

    var stext = ss(tnode.text);
    if (!stext) stext = "_";
    if (isFile(tnode)) {
        var extloc = stext.indexOf(".");
        var ext = "";
        var name = stext;
        if (extloc != -1) {
            ext = stext.substring(extloc);
            stext.substring(0, extloc);
        }
        while (stext in d) {
            name += "_";
            stext = name+ext;
        }
        contentBox.rename_node(tnode, stext);
        return stext;
    } else {
        while (stext+"/" in d) stext += "_";
        if (d == data && ttypes.indexOf(stext) != -1) {
            contentBox.set_type(tnode, stext);
        }
        contentBox.rename_node(tnode, stext);
        return stext+"/";
    }
}

var content_data = [
    {"text": "meta", "type": "meta"},
    {"text": "tags", "type": "tags", "children": [
        {"text": "blocks"},
        {"text": "entity_types"},
        {"text": "fluids"},
        {"text": "functions"},
        {"text": "items"}
    ]},
    {"text": "functions", "type": "functions"},
    {"text": "predicates", "type": "predicates"},
    {"text": "recipes", "type": "recipes"},
    {"text": "loot_tables", "type": "loot_tables"},
    {"text": "advancements", "type": "advancements"}
];
if (!simplified) {
    content_data.push(
        {"text": "origin_layers", "type": "origin_layers", "children": [
            {"text": "origins:origin", "type": "file"}
        ]},
        {"text": "origins", "type": "origins"},
        {"text": "powers", "type": "powers"}
    );
}

var content_box = {
    "core": {
        "data": content_data,
        "themes": {
            "name": "proton",
            "variant": "small",
            "responsive": false
        },
        "force_text": true,
        "check_callback": true
    },
    "types": {
        "file": {"icon": "/i/origincreator/file.png", "max_depth": 0},
        "meta": {"icon": "/i/origincreator/file.png", "max_depth": 0},
        "origin_layers": {"icon": "/i/origincreator/layer.png"},
        "origins": {"icon": "/i/origincreator/origin.png"},
        "powers": {"icon": "/i/origincreator/power.png"},
        "tags": {"icon": "/i/origincreator/tag.png"},
        "functions": {"icon": "/i/origincreator/function.png"},
        "predicates": {"icon": "/i/origincreator/predicate.png"},
        "advancements": {"icon": "/i/origincreator/advancement.png"},
        "recipes": {"icon": "/i/origincreator/recipe.png"},
        "loot_tables": {"icon": "/i/origincreator/loot_table.png"}
    },
    "conditionalselect": function (node, event) {
        return isFile(node);
    },
    "dnd": {
        "is_draggable": function (node, event) {
            return isFreeNode(node[0]);
        },
        "large_drop_target": true,
        "copy": false
    },
    "sort": function(a, b) {
        contentBox = $("#content-box").jstree(true);
        var na = contentBox.get_node(a);
        var nb = contentBox.get_node(b);

        var af = isFreeNode(na);
        var bf = isFreeNode(nb);
        if (af) {
            if (bf) {
                // Two unlocked elements
                af = isFile(na);
                bf = isFile(nb);
                if (af) {
                    if (bf) return na.text.localeCompare(nb.text); // Both are files so compare normally
                    else return 1; // b is a folder and comes before file a
                } else {
                    if (bf) return -1; // a is a folder and comes before file b
                    else return na.text.localeCompare(nb.text); // Both are folders so compare normally
                }
            }
            else return 1; // b is locked and comes before unlocked a
        } else {
            if (bf) return -1; // a is locked and comes before unlocked b
            else {
                return Math.sign(ttypes.indexOf(na.text)-ttypes.indexOf(nb.text)); // Both are locked, so return whatever is first in ttypes
            }
        }
    },
    "contextmenu": {         
        "items": function (node) {
            contentBox = $("#content-box").jstree(true);
            return {
                "new-file": {
                    "label": "New File",
                    "action": function (e) {
                        var nnode = contentBox.create_node(node);
                        contentBox.set_type(nnode, "file");
                        contentBox.edit(nnode, "new_item", function (node, status, cancel) {
                            var d = findNodeData(node, true);
                            var newName = fixName(node, d);
                            d[newName] = {};
                            save();
                        });
                    },
                    "_disabled": function () {
                        return isFile(node);
                    }
                },
                "new-folder": {
                    "label": "New Folder",
                    "action": function (e) {
                        var nnode = contentBox.create_node(node);
                        contentBox.edit(nnode, "folder", function (node, status, cancel) {
                            var d = findNodeData(node, true);
                            var newName = fixName(node, d);
                            d[newName] = {};
                            save();
                        });
                    },
                    "_disabled": function () {
                        return isFile(node);
                    }
                },
                "cut": {
                    "separator_before": true,
                    "label": "Cut",
                    "action": function (e) {
                        var ndata = findNodeData(node, true);

                        // Copy
                        clipedTree = true;
                        if (isFile(node)) dataClipboard = JSON.stringify(ndata[node.text]);
                        else dataClipboard = JSON.stringify([node.text, node.type, ndata[node.text+"/"]]);

                        // Delete
                        if (isFile(node)) delete ndata[node.text];
                        else delete ndata[node.text+"/"];
                        contentBox.delete_node(node);
                        if (node.state.selected) changeScreen("help");
                        save();
                    },
                    "_disabled": function () {
                        return !isFreeNode(node);
                    }
                },
                "copy": {
                    "label": "Copy",
                    "action": function (e) {
                        if (isFreeNode(node)) {
                            // Copy
                            var ndata = findNodeData(node, true);
                            clipedTree = true;
                            if (isFile(node)) dataClipboard = JSON.stringify([node.text, node.type, ndata[node.text]]);
                            else dataClipboard = JSON.stringify([node.text, node.type, ndata[node.text+"/"]]);
                            save();
                        }
                    },
                    "_disabled": function () {
                        return !isFreeNode(node);
                    }
                },
                "paste": {
                    "label": "Paste",
                    "action": function (e) {
                        if (!isFile(node)) {
                            var o = JSON.parse(dataClipboard);
                            var nnode = contentBox.create_node(node);
                            contentBox.rename_node(nnode, o[0]);
                            contentBox.set_type(nnode, o[1]);
                            
                            var d = findNodeData(node);
                            var newName = fixName(nnode, d);
                            d[newName] = o[2];
                            save();
                        }
                    },
                    "_disabled": function () {
                        return !clipedTree || !dataClipboard || isFile(node);
                    }
                },
                "rename": {
                    "separator_before": true,
                    "label": "Rename",
                    "action": function (e) {
                        var otext = node.text;
                        var d = findNodeData(node, true);
                        if (isFreeNode(node)) contentBox.edit(node, otext, function(node, status, cancel) {
                            var newName = fixName(node, d);
                            if (isFile(node)) {
                                d[newName] = d[otext];
                                delete d[otext];
                            } else {
                                d[newName] = d[otext+"/"];
                                delete d[otext+"/"];
                            }
                            if (node.state.selected) $("#div-"+activeType+">h2").text(activePath+"/"+newName);
                            save();
                        });
                    },
                    "_disabled": function () {
                        return !isFreeNode(node);
                    }
                },                         
                "delete": {
                    "label": "Delete",
                    "action": function (e) {
                        var ndata = findNodeData(node, true);
                        if (isFile(node)) delete ndata[node.text];
                        else delete ndata[node.text+"/"];
                        contentBox.delete_node(node);
                        if (node.state.selected) changeScreen("help");
                        save();
                    },
                    "_disabled": function () {
                        return node.type == "meta";
                    }
                }
            }
        }
    },
    "plugins": [
        "changed", "conditionalselect", "dnd", "themes", "types", "contextmenu", "sort"
    ]
};
function moveTreeItem(e, data) {
    contentBox = $("#content-box").jstree(true);
    if (data.parent != data.old_parent) {
        var oldLoc = findNodeData(data.old_parent);
        var newLoc = findNodeData(data.parent);

        var oldName = data.node.text;
        if (data.node.type == "default") oldName += "/";
        var newName = fixName(data.node, newLoc);

        newLoc[newName] = oldLoc[oldName];
        delete oldLoc[oldName];

        if (data.node.state.selected) selectContent(null, {"node": data.node});

        save();
    }
};
function addTreeType() {
    var nnode = contentBox.create_node("#");
    contentBox.edit(nnode, "folder", function (node, status, cancel) {
        var newName = fixName(node, data);
        data[newName] = {};
        save();
    });
}
function addTreeFile() {
    var nnode = contentBox.create_node("#");
    contentBox.set_type(nnode, "file");
    contentBox.edit(nnode, "new_item", function (node, status, cancel) {
        var newName = fixName(node, data);
        data[newName] = {};
        save();
    });
}

function addListItem(btn, relevel=0) {
    var pnl = $(btn.parentElement);
    var lbtn = $(btn);
    
    var level = parseInt(lbtn.attr("level"));
    var cs = "panel";
    if (level % 2 == 1) {
        cs = "panel panel-dark";
    }
    
    var i = pnl.find(">.panel").length;
    
    lbtn.before(`<div name="${i}" class="${cs} m _${i}"><button class="mb zlist-button sbutton" onclick="copyListItem(this)">+</button><button class="mb zlist-button sbutton" onclick="removeListItem(this)">-</button><button class="mb zlist-button sbutton" onclick="listItemUp(this)">˄</button><button class="mb zlist-button sbutton" onclick="listItemDown(this)">˅</button><br></div><br>`);
    var ipanel = pnl.find(">._"+i);
    ipanel.addClass("selectable");
    
    var iID = getPath(btn) + "--" + i;
    var form = locateForm(iID);
    insertForm(ipanel, "", form, iID, level+1);
    
    // Find data location to create item (javascript is very nice at this)
    var d = locateData(iID);
    // Load list item specifically
    loadEntries(relevel, ipanel, d, form);
    
    // Don't forget to save!
    save();
}
function clearList(btn, itemID) {
    // Clear html
    var jqb = $(btn);
    var list = jqb.parent();
    list.children("div,br").remove();
    jqb.prev().before("<br>");
    
    // Clear data
    locateData(getPath(btn.parentElement))[itemID] = [];
    
    // Don't forget to save!
    save();
}

function copyListItem(btn) {
    var pnl = $(btn.parentElement);
    
    // Get panel data
    var pnlp = pnl.parent();
    var i = parseInt(pnl.attr("name"));
    
    // Copy item in data array
    var list = locateData(getPath(btn.parentElement));
    list.splice(i, 0, JSON.parse(JSON.stringify(list[i]))); // Javascript lacks good deep cloning, but this'll do since I'm not doing anything special.
    
    // Clone element (and <br>)
    var clone = pnl.clone().insertAfter(pnl);
    clone.before("<br>");
    clone.attr("name", i+1);
    clone.removeClass("_"+i);
    clone.addClass("_"+(i+1));
    //clone.click(selectPanel);
    
    // Move all elements below down one (This is why the rewrite was required)
    var elems = pnlp.find(">div");
    for (let j = i+2; j < elems.length; j++) {
        let jelem = $(elems[j]);
        jelem.attr("name", String(j));
        jelem.removeClass("_"+String(j-1));
        jelem.addClass("_"+String(j));
    }
    
    //changeScreen(activeType, activeParent, activeUName, activePath); // HACK: only loading list item is necessary
    var iID = getPath(clone.get(0)) + "--" + (i+1);
    var form = locateForm(iID);
    var d = locateData(iID);
    loadEntries(0, clone, d, form);
    
    // Don't forget to save!
    save();
}

function removeListItem_(pnl) {
    // Get panel data
    var pnlp = pnl.parent();
    var i = parseInt(pnl.attr("name"));
    
    // Remove item from data array
    locateData(getPath(pnl.get(0))).splice(i, 1);
    
    // Remove element (and <br> after it)
    pnl.next().remove();
    pnl.remove();
    
    // Move all elements below up one (This is why the rewrite was required)
    var elems = pnlp.find(">div");
    for (let j = i; j < elems.length; j++) {
        let jelem = $(elems[j]);
        jelem.attr("name", String(j));
        jelem.removeClass("_"+String(j+1));
        jelem.addClass("_"+String(j));
    }
    
    // Don't forget to save!
    save();
}
function removeListItem(btn) {
    removeListItem_($(btn.parentElement));
}

function moveListItem(pnl, list) {
    // Remove line break
    var i = parseInt(pnl.attr("name"));
    
    if (i > 0) {
        pnl.prev("br").remove();
        // Swap elements in data
        [list[i-1], list[i]] = [list[i], list[i-1]];
        // Swap elements in html
        var prepnl = pnl.prevAll("div").first();

        prepnl.removeClass("_"+(i-1));
        prepnl.addClass("_"+i);
        prepnl.attr("name", String(i));

        pnl.removeClass("_"+i);
        pnl.addClass("_"+(i-1));
        pnl.attr("name", String(i-1));

        pnl.after(prepnl);
        pnl.after("<br>");
    }
    
    // Don't forget to save!
    save();
}

function listItemUp(btn) {
    var pnl = $(btn.parentElement);
    moveListItem(pnl, locateData(getPath(btn.parentElement)));
}

function listItemDown(btn) {
    // listItemDown kind of cheats by calling list item up on the next panel
    var pnl = $(btn.parentElement).nextAll("div").first();
    if (pnl.length) moveListItem(pnl, locateData(getPath(btn.parentElement)));
}


function changeMulti(sel) {
    var pnl = $(sel.parentElement);
    var v = sel.value;
    var div = pnl.find(">.multi-"+v);

    pnl.find(">div").addClass("nodisplay");
    div.removeClass("nodisplay");

    var datapath = getPath(sel.parentElement);
    var j = 0; // Handle something with an underscore at the start? Panels generate with an extra underscore so j is here to remove it
    if (pnl.hasClass("panel")) {
        datapath = getPath(sel.parentElement, true);
        j = 1;
    }
    var i = datapath.lastIndexOf("--");

    // I... kind of forget how this works exactly, but it does so oh well
    // Panel-less items are inside of lists and need to be handled differently
    if (v == "extra") {
        var temp = {};
        locateData(datapath.substring(0,i))[datapath.substring(i+2+j)] = temp;

        var form = locateForm(datapath.substring(0,i))[pnl.attr("name").substring(1)];
        form = form.data[form.options.indexOf(v)];
        if (form) loadEntries(0, div, temp, form, true);
    } else {
        delete locateData(datapath.substring(0,i))[datapath.substring(i+2+j)];
        // TODO: support more than just this
        div.find(">input").val("");
    }
    save();
}