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

var fnode = null;
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
    "types": jstree_types,
    "conditionalselect": function (node, event) {
        return isFile(node) && node.id !== fnode;
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
                        fnode = nnode;
                        contentBox.edit(nnode, "new_item", function (node, status, cancel) {
                            var d = findNodeData(node, true);
                            var newName = fixName(node, d);
                            d[newName] = "";
                            fnode = null;
                            save();
                        });
                    },
                    "_disabled": function () {
                        return isFile(node) || node.id === fnode;
                    }
                },
                "new-folder": {
                    "label": "New Folder",
                    "action": function (e) {
                        var nnode = contentBox.create_node(node);
                        fnode = nnode;
                        contentBox.edit(nnode, "folder", function (node, status, cancel) {
                            var d = findNodeData(node, true);
                            var newName = fixName(node, d);
                            d[newName] = {};
                            fnode = null;
                            save();
                        });
                    },
                    "_disabled": function () {
                        return isFile(node) || node.id === fnode;
                    }
                },
                "cut": {
                    "separator_before": true,
                    "label": "Cut",
                    "action": function (e) {
                        cutNodeItem(node);
                    },
                    "_disabled": function () {
                        return !isFreeNode(node) || node.id === fnode;
                    }
                },
                "copy": {
                    "label": "Copy",
                    "action": function (e) {
                        copyNodeItem(node);
                    },
                    "_disabled": function () {
                        return !isFreeNode(node) || node.id === fnode;
                    }
                },
                "paste": {
                    "label": "Paste",
                    "action": function (e) {
                        pasteNodeItem(node);
                    },
                    "_disabled": function () {
                        return !clipedTree || !dataClipboard || isFile(node) || node.id === fnode;
                    }
                },
                "rename": {
                    "separator_before": true,
                    "label": "Rename",
                    "action": function (e) {
                        var otext = node.text;
                        var d = findNodeData(node, true);
                        if (isFreeNode(node)) contentBox.edit(node, otext, function(node, status, cancel) {
                            if (otext != node.text) {
                                var newName = fixName(node, d);
                                if (isFile(node)) {
                                    d[newName] = d[otext];
                                    delete d[otext];
                                } else {
                                    d[newName] = d[otext+"/"];
                                    delete d[otext+"/"];
                                }
                                activeUName = newName
                                if (node.state.selected) {
                                    if (types.includes(activeType)) $("#div-"+activeType+">h2").text(activePath+"/"+newName);
                                    else $("#div-other>h2").text(activePath+"/"+newName);
                                }
                                save();
                            }
                        });
                    },
                    "_disabled": function () {
                        return !isFreeNode(node) || node.id === fnode;
                    }
                },                         
                "delete": {
                    "label": "Delete",
                    "action": function (e) {
                        deleteNodeItem(node);
                    },
                    "_disabled": function () {
                        return node.type == "meta" || node.id === fnode;
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

function cutNodeItem(node) {
    if (isFreeNode(node) && node.id !== fnode) {
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
    }
}
function deleteNodeItem(node) {
    if (node.type != "meta" && node.id !== fnode) {
        var ndata = findNodeData(node, true);
        if (isFile(node)) delete ndata[node.text];
        else delete ndata[node.text+"/"];
        contentBox.delete_node(node);
        if (node.state.selected) changeScreen("help");
        save();
    }
}
function copyNodeItem(node) {
    if (isFreeNode(node) && node.id !== fnode) {
        // Copy
        var ndata = findNodeData(node, true);
        clipedTree = true;
        if (isFile(node)) dataClipboard = JSON.stringify([node.text, node.type, ndata[node.text]]);
        else dataClipboard = JSON.stringify([node.text, node.type, ndata[node.text+"/"]]);
        save();
    }
}
function pasteNodeItem(node) {
    if (clipedTree && dataClipboard && !isFile(node) && node.id !== fnode) {
        var o = JSON.parse(dataClipboard);
        var nnode = contentBox.create_node(node);
        contentBox.rename_node(nnode, o[0]);
        contentBox.set_type(nnode, o[1]);
        
        var d = findNodeData(node);
        var newName = fixName(nnode, d);
        d[newName] = o[2];
        save();
    }
}

function addListItem(btn, relevel=0, namedID=null) {
    var pnl = $(btn.parentElement);
    var lbtn = $(btn);
    
    var level = parseInt(lbtn.attr("level"));
    var cs = "panel";
    if (level % 2 == 1) {
        cs = "panel panel-dark";
    }

    var i = pnl.find(">.panel").length;
    var path = getPath(btn);
    
    var dataLoc;
    
    if (pnl.attr("ttype") == "nlist") {
        var itemID = namedID;
        if (namedID !== null) {
            // Find data location to get existing element
            path += "--" + i;
            dataLoc = locateData(path);
        } else {
            // Find data location
            dataLoc = locateData(path, false, itemID);
            path += "--" + i;

            // Generate unique name for named list item
            var pnlName = pnl.attr("name").substring(2);
            itemID = pnlName + "_" + i;
            while (itemID in dataLoc || itemID == "o__") itemID += "_"
    
            // Create element in data (because it doesn't exist)
            dataLoc[itemID] = {};
            dataLoc = dataLoc[itemID];
        }

        // Insert item html
        lbtn.before(`<div name="${i}" class="${cs} m _${i}"><button class="mb zlist-button sbutton" onclick="copyListItem(this, true)">+</button><button class="mb zlist-button sbutton" onclick="removeListItem(this, true)">-</button><button class="mb zlist-button sbutton" onclick="listItemUp(this, true)">˄</button><button class="mb zlist-button sbutton" onclick="listItemDown(this, true)">˅</button> <input class="zlist-id" value="${itemID}" onchange="listItemRename(this)"><br></div><br>`);
    } else {
        // Find data location to create element
        path += "--" + i;
        dataLoc = locateData(path);

        // Insert item html
        lbtn.before(`<div name="${i}" class="${cs} m _${i}"><button class="mb zlist-button sbutton" onclick="copyListItem(this)">+</button><button class="mb zlist-button sbutton" onclick="removeListItem(this)">-</button><button class="mb zlist-button sbutton" onclick="listItemUp(this)">˄</button><button class="mb zlist-button sbutton" onclick="listItemDown(this)">˅</button><br></div><br>`);
    }

    // Find newly created panel and make it selectable
    var ipanel = pnl.find(">._"+i);
    ipanel.addClass("selectable");
    
    // Insert form into list item
    var form = locateForm(path);
    insertForm(ipanel, "", form, level+1);

    // Load list item specifically
    loadEntries(relevel, ipanel, dataLoc, form);
    // Don't forget to save!
    save();
}
function clearList(btn, itemID, named) {
    // Clear html
    var jqb = $(btn);
    var list = jqb.parent();
    list.children("div,br").remove();
    jqb.prev().before("<br>");
    
    // Clear data
    locateData(getPath(btn.parentElement))[itemID] = named ? {} : [];
    
    // Don't forget to save!
    save();
}

function copyListItem(btn, named) {
    var pnl = $(btn.parentElement);
    
    // Get panel data
    var pnlp = pnl.parent();
    var i = parseInt(pnl.attr("name"));
    
    var list = locateData(getPath(btn.parentElement));

    // Copy data
    // Javascript lacks good deep cloning, but this'll do since I'm only copying json data.
    if (named) {
        var keys = Object.keys(list);
        var itemID = keys[i] + "_";
        while (itemID in list || itemID == "o__") itemID += "_"

        insertIn(list, i+1, itemID, JSON.parse(JSON.stringify(list[keys[i]])));
    } else {
        list.splice(i, 0, JSON.parse(JSON.stringify(list[i])));
    }
    
    // Clone element (and <br>)
    var clone = pnl.clone();
    clone.attr("name", i+1);
    clone.removeClass("_"+i);
    clone.addClass("_"+(i+1));
    clone.insertAfter(pnl);
    clone.before("<br>");
    //clone.click(selectPanel);
    clone.find(">.zlist-id").val(itemID);
    
    // Move all elements below down one (This is why the rewrite was required)
    var elems = pnlp.find(">div");
    for (let j = i+2; j < elems.length; j++) {
        let jelem = $(elems[j]);
        jelem.attr("name", String(j));
        jelem.removeClass("_"+String(j-1));
        jelem.addClass("_"+String(j));
    }
    
    var iID = getPath(clone.get(0)) + "--" + (i+1);
    var form = locateForm(iID);
    var d = locateData(iID);
    loadEntries(0, clone, d, form);
    
    // Don't forget to save!
    save();
}

function removeListItem_(pnl, named, loading) {
    // Get panel data
    var pnlp = pnl.parent();
    var i = parseInt(pnl.attr("name"));
    
    // Remove item from data array
    if (!loading) {
        var d = locateData(getPath(pnl.get(0)));
        if (named) {
            delete d[Object.keys(d)[i]];
        } else {
            d.splice(i, 1);
        }
    }
    
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
function removeListItem(btn, named) {
    removeListItem_($(btn.parentElement), named);
}

// Swaps a list item with the one above it.
function moveListItem(pnl, list, named) {
    // Remove line break
    var i = parseInt(pnl.attr("name"));
    
    if (i > 0) {
        pnl.prev("br").remove();
        // Swap elements in data
        if (named) {
            pushDownIn(list, i-1);
        } else {
            [list[i-1], list[i]] = [list[i], list[i-1]];
        }

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

function listItemUp(btn, named) {
    var pnl = $(btn.parentElement);
    moveListItem(pnl, locateData(getPath(btn.parentElement)), named);
}

function listItemDown(btn, named) {
    // listItemDown kind of cheats by calling list item up on the next panel
    var pnl = $(btn.parentElement).nextAll("div").first();
    if (pnl.length) moveListItem(pnl, locateData(getPath(btn.parentElement)), named);
}

// Function that gets called when a list item is renamed.
function listItemRename(input) {
    var pnl = $(input.parentElement);
    var i = parseInt(pnl.attr("name"));
    var d = locateData(getPath(input.parentElement));
    var ignored = locateForm(getPath(input.parentElement.parentElement)).o__.ignore;

    var key = Object.keys(d)[i];
    var temp = d[key];
    delete d[key];

    // Generate unique name for named list item
    var itemID = input.value;
    while (itemID in d || ignored.includes(itemID) || itemID == "o__") itemID += "_";
    input.value = itemID;

    // Reinsert data
    insertIn(d, i, itemID, temp);

    // Saving is critical!
    save();
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