// Loads dictionary into html (creating options as necessary)
function loadData(ocd) {
    "use strict";
    if (!ocd) {
        return "Couldn't find data to load.";
    }

    // Load into data
    data = JSON.parse(ocd);
    if (!data.meta) data.meta = {
        "name": "My Pack",
        "id": "mypack"
    };
    if (!data.meta.id) data.meta.id = "mypack";
    pid = data.meta.id;
    //if (data.$ !== 3) convertData(); // If data conversion is necessary

    // Create items in listbox
    //let item
    //for (const type of types) {
    //    if (data[type]) {
    //        item = $("#" + type + "s-group>.newitem");
    //        for (const itemid of Object.keys(data[type])) {
    //            item.before(`<option class="ocitem" value="${type}-${itemid}">${itemid}</option>`);
    //        }
    //    }
    //}

    // First distroy the entire content box
    if (contentBox) $("#content-box").jstree("destroy");

    // Then format content box data
    var cdata = [];
    for (const [key, val] of Object.entries(data)) {
        var v = typeof(val);
        if (v == "string" || v == "object") {
            if (key[key.length-1] == "/") {
                var children = [];
                var name = key.substring(0, key.length-1);
                cdata.push({"text": name, "type": (iconed.indexOf(key) == -1 ? "default" : name), "children": children});
                rLoadData(children, val);
            } else {
                cdata.push({"text": key, "type": (iconed.indexOf(key) == -1 ? "file" : key)});
            }
        }
    }

    // Then remake content box
    content_box.core.data = cdata;
    contentBox = $("#content-box").jstree(content_box);
    contentBox.bind("move_node.jstree", moveTreeItem);
    contentBox.bind("select_node.jstree", selectContent);
    
    // Change the header in the Metadata
    $("#div-meta h2").text("pack - " + data.meta.name);
    $("#side-main-head").text(data.meta.name);

    // Save data to keep things in sync
    save();
}
function rLoadData(cdata, fdata) {
    for (const [key, val] of Object.entries(fdata)) {
        if (key[key.length-1] == "/") {
            var children = [];
            var name = key.substring(0, key.length-1);
            cdata.push({"text": name, "children": children});
            rLoadData(children, val);
        } else {
            cdata.push({"text": key, "type": "file"});
        }
    }
}
function convertData() {
    if (!data.$) {
        for (let [name, type] of [["layer", "origin_layers/"], ["origin", "origins/"], ["power", "powers/"], ["tag", "tags/"]]) {
            if (name in data) {
                data[type] = data[name];
                delete data[name];
                for (let [item, itemData] of Object.entries(data[type])) {
                    let id = item;
                    let c = item.indexOf(":");
                    if (c != -1) {
                        let namespace = item.substring(0, c);
                        if (namespace === pid) id = item.substring(c+1);
                    }
                    id = ss(id);

                    if (id != item) {
                        data[type][id] = itemData;
                        delete data[type][item];
                    }
                }
            }
        }
        data.$ = 2;
        data["functions/"] = {};
        data["predicates/"] = {};
        data["advancements/"] = {};
        data["recipes/"] = {};
        data["loot_tables/"] = {};

        delete data.recipe;
        delete data.advancement;
        delete data.function;
        delete data.loot_table;

        if (data.other) data.other = JSON.stringify(data.other, null, 4);
    }
    if (data.$ < 3) {
        // Convert layers
        convertLayers(data["origin_layers/"]);
        // Convert tags
        convertTags(data["tags/"]);

        data.$ = 3;
    }
}
function convertLayers(folder) {
    for (let [layerID, layer] of Object.entries(folder)) {
        if (layerID[layerID.length-1] == "/") {
            convertLayers(layer);
        } else {
            if (layer.conditional_origins) {
                if (layer.origins) layer.origins = layer.origins.concat(layer.conditional_origins);
                else layer.origins = layer.conditional_origins;
                delete layer.conditional_origins;
            }
        }
    }
}
function convertTags(folder) {
    for (let [tagID, tag] of Object.entries(folder)) {
        if (tagID[tagID.length-1] == "/") {
            convertTags(tag);
        } else {
            if (tag.required_values) {
                if (tag.values) tag.values = tag.values.concat(tag.required_values);
                else tag.values = tag.required_values;
                delete tag.required_values;
            }
        }
    }
}

// Find an element's datapath (which is dynamic thanks to lists... yuck. Oh well)
function getPath(elem, selfish) {
    var nList = [];
    if (selfish) nList.push(elem.getAttribute("name"));
    
    var l = elem.parentElement;
    while (l) { // Do while "could" be better, but I really don't know
        if (l.tagName != "DIV") break;
        nList.push(l.getAttribute("name"));
        l = l.parentElement;
    };
    nList.reverse();
    return nList.join("--");
};
// Find an item based on a datapath/element id
function findItem(...datapaths) {
    return $("._"+datapaths.join(">._").replace(/--/g, ">._").replace(":", "-__-"));
}
function findChildItem(parent, ...datapaths) {
    return parent.find(">._"+datapaths.join(">._").replace(/--/g, ">._").replace(":", "-__-"))
}

function locateForm(datapath, id) {
    var spath = datapath.split("--");
    // Find starting location
    var formloc = forms[spath[0]];
    
    // Finish finding form location
    for (let i = 1; i < spath.length; i++) {
        let path = spath[i].replace("-__-", ":");
        if (path[0] == "-") path = path.substring(1);
        
        if (path != "" && !isNaN(path)) continue;
        
        let newFormLoc = formloc[path];
        if (!newFormLoc) continue;
        if (newFormLoc.type == "more") {
            let v = spath[i+1].replace("-__-", ":");
            //if (!v) findItem(spath.slice(0, i).join("--"), newFormLoc.parent).val();
            formloc = newFormLoc.data[v];
            i++;
        } else if (newFormLoc.type == "multi") {
            formloc = newFormLoc.data[newFormLoc.options.indexOf("extra")];
        } else {
            formloc = newFormLoc.data;
        }
    }
    if (id != undefined) {
        var lpid = id;
        if (id[0] == "-") lpid = id.substring(1);
        
        if (!formloc[lpid]) return null;
        else if (formloc[lpid].type == "multi") {
            return formloc[lpid].data[formloc[lpid].options.indexOf("extra")];
        }
        else return formloc[lpid].data;
    }
    else return formloc;
}

function locateData(datapath, nosub) {
    var spath = datapath.replace("-__-", ":").split("--");
    if (spath[spath.length-2] == "_") spath = spath.slice(0, -2); // Get rid of bad values at the end of a list datapath multis

    // Find starting location
    var loc = active;
    // Finish finding location (here because maybe meta has a panel)
    for (let i = 1; i < spath.length; i++) {
        if (!spath[i]) { // Skip empty things
        } else if (spath[i][0] === "_") { // Skip things that don't want to be stored
            if (spath[i][1] === "_") i++;
        } else if (spath[i][0] === "-") { // Handle lists
            let newLoc = loc[spath[i].substring(1)];
            // If the list doesn't exist, it needs to be created
            if (typeof(newLoc) != "object") {
                newLoc = [];
                loc[spath[i].substring(1)] = newLoc;
            }
            
            // You got to figure out the selected element in order to get the right index
            i++;
            let index = parseInt(spath[i]);
            if (isNaN(index)) {
                // Without a valid index, the list itself becomes the next location
                loc = newLoc;
            } else {
                if (newLoc.length < index+1) {
                    // List needs to be brought up to size
                    for (let j = newLoc.length; j < index+1; j++) newLoc[j] = {};
                }
                
                // For non-dict items in lists
                if (i == spath.length-1 && nosub) return [newLoc, index];
                
                if (typeof(newLoc[index]) != "object" && i != spath.length-1) newLoc[index] = {}; // Ensure this is an object if reading past it
                loc = newLoc[index];
            }
        } else {
            let newLoc = loc[spath[i]];
            // If the location doesn't exist, it needs to be created
            if (typeof(newLoc) != "object") {
                newLoc = {};
                loc[spath[i]] = newLoc;
            }
            loc = newLoc;
        }
    }
    
    return loc;
}

// Called by entries "onchange" to insert their data into a datapath
//+insertData(str datapath, str key, elem item)
//    - datapath - A datapath to a dictionary to insert into. "layer.~origins" or "power". ~ Means that this item is a list (and it will be treated specially)
//    - key - Place in the dictionary to insert the value.
//    - type - The type of entry field this is
//    - item - A place where "this" in the onchange is sent through the function. Use this.value to get the value.
function insertData(key, type, item, extra) {
    "use strict";
    var datapath = getPath(item);
    var loc = locateData(datapath, !key);
    var v = item.value;
    
    // Options need happen regardless of whether or not loc exists
    if (type === "options") { // Options need to change the visible "more" panel
        if (loc) {
            if (v == " ") {
                delete loc[key];
            } else {
                loc[key] = v;
            }
        }
        if (extra) {
            // For performace, removing hidden subpanels from the html might be a good idea.
            var p = findItem(datapath, extra).find(">div");
            p.addClass("nodisplay");
            findItem(datapath, extra, jqns(v)).removeClass("nodisplay");
            changeScreen(activeType, activeParent, activeUName, activePath); // HACK: this is lazy, but it's fine.
        }
        save();
        return;
    }
    if (!loc) return;
    
    // For lists without dictionaries
    if (!key) {
        key = loc[1];
        loc = loc[0];
    }
    
    switch (type) {
        case "textlist":
            if (v) {
                loc[key] = v.split(/\r\n|\r|\n/g);
            } else {
                delete loc[key];
            }
            break;
        case "ace":
            let editor = ace.edit("ace-"+extra);
            v = editor.getValue();
            if (v) {
                loc[key] = JSON.parse(v);
            } else {
                delete loc[key];
            }
            break;
        case "main": // Main field needs to update the header and left panel side-main-head
            loc[key] = v;
            $("#side-main-head").text(v);
            $("#div-meta h2").text("pack - " + v);
            break;
        case "image": // Images need to be converted to 128x128 png/base64 for safe keeping
            var reader = new FileReader();
            reader.onload = function() {
                // Create image
                var img = new Image();
                img.onload = function(e) {
                    // Resize image
                    $("body").append('<canvas id="imgcanvas" class="hidden" width="128px" height="128px">')
                    var ctx = document.getElementById("imgcanvas").getContext("2d");
                    ctx.drawImage(e.target, 0, 0, 128, 128);
                    
                    // Grab the source information
                    var output = ctx.canvas.toDataURL("image/png");
                    
                    findItem(datapath).find(">.i_"+key).attr("src", output);
                    loc[key] = output;
                    
                    // Delete the element
                    $("#imgcanvas").remove();
                    
                    // Save (because race conditions)
                    save();
                }
                img.src = reader.result;
            };
            if (item.files.length) reader.readAsDataURL(item.files[0]);
            break;
        case "cimage": // For clearing images
            findItem(datapath).find(">.i_"+key).attr("src", "");
            findItem(datapath, key).val("");
            delete loc[key];
        case "checkbox":
            v = item.checked;
            loc[key] = v
            break;
        case "bool":
            if (v == "unspecified") {
                delete loc[key];
            } else {
                loc[key] = v === "true";
            }
            break;
        case "ns": // Normalized strings just need to be normalized
            if (v === "") {
                if (Array.isArray(loc)) loc[key] = "";
                else delete loc[key];
            } else {
                v = ns(v);
                item.value = v;
                loc[key] = v;
            }
            pid = data.meta.id; // FIXME: This should go in it's own separate thing
            break;
        case "int":
            if (v === "") {
                delete loc[key];
            } else {
                v = Math.round(v);
                item.value = v;
                loc[key] = v;
            }
            break;
        case "double":
            if (v === "") {
                delete loc[key];
            } else {
                v = parseFloat(v);
                item.value = v;
                loc[key] = v;
            }
            break;
        default:
            if (v === "") {
                if (Array.isArray(loc)) loc[key] = "";
                else delete loc[key];
            } else {
                loc[key] = v;
            }
            break;
    }
    
    // Always gotta save that progress!
    save();
}

// Internal function called to load data from a dictionary into entries based on a form.
// +loadEntries(str rootid, dict data, dict form)
//    - level - 
//    - rootid - First part of the ID of the html elements to insert into. It does not need to point to an existing element.
//    - data - Dictionary containing the values to insert into the form, and to clean.
//    - form - Dictionary of a form containing the metadata of how to insert values.
//    - id - id of the dictionary, necessary for filling in "id" types.
function loadEntries(level, rootElem, data, form, del) {
    "use strict";
    if (data && form) {
        var moreForms = [];
        var nodel = false;

        // Load data
        for (const [itemID, item] of Object.entries(form)) {
            // Spaghetti code is TIGHT!
            let elem = findChildItem(rootElem, itemID);
            if (item.type == "list") {
                elem = findChildItem(rootElem, "-"+itemID);
            }

            let v = data[itemID];
            if (item.type == "multi") {
                elem = findChildItem(rootElem, "_"+itemID);
                if (elem.hasClass("panel")) {
                    if (data[itemID] === undefined) {
                        v = null;
                        //data[itemID] = v;
                    }
                } else if (v === undefined) v = data;
            } else {
                if (v == undefined) v = item.default;
                if (v == undefined) v = "";

                if (itemID.length > 1) {
                    if (data[itemID] === undefined && item.default) data[itemID] = v;
                } else { // Yes this is hacky and no I don't care
                    if (typeof(data) == "object") {
                        v = item.default || "";
                    } else {
                        v = data || item.default || "";
                    }
                }
            }

            // Make sure subpanels are expanded or hidden as needed
            if (item.type == "list" || item.type == "sub" || item.type == "dict") {
                let c = elem.children();
                if (data[itemID] && c.length == 1) {
                    // Panel needs to be added
                    insertPanel(c.get(0));
                } else if ((!data[itemID]) && c.length > 1) {
                    // Panel needs to be removed
                    removePanel(c.get(0));
                }
            }

            switch (item.type) {
                case "info": break;
                case "list": // Fill in lists
                    let list = data[itemID];
                    if (list) {
                        let elems = elem.find(">div");
                        // Create or remove elements to match length
                        let cl = elems.length;
                        if (cl < list.length) { // Add elements if too few
                            let btn = elem.find(">.zlist-button").get(0);
                            for (let i = cl; i < list.length; i++) addListItem(btn, level);
                        } else if (cl > list.length) { // Remove elements if too many
                            for (let i = cl-1; i > list.length-1; i--) removeListItem_(elems.eq(i));
                        }

                        // Iterate over elements and load each individually
                        elems = elem.find(">div");
                        for (let i = 0; i < list.length; i++) {
                            loadEntries(level+1, elems.eq(i), list[i], form[itemID].data, true)
                        }
                    }
                    break;
                case "sub": // Fill in sub-forms
                    loadEntries(level+1, elem, data[itemID], form[itemID].data, true);
                    break;
                case "dict": // AW no. At least not right now.
                    break;
                case "more": // more doesn't load anything on it's own. This is the job of options
                    break;
                case "options": // Load option and more
                    // Load more
                    if (item.options) {
                        if (!v) v = item.options[0];
                        if (!item.options.includes(v)) {
                            v = "???";
                            nodel = true;
                        }
                    } else if (item.more) {
                        let keys = Object.keys(form[item.more].data);
                        if (!v) v = keys[0];
                        if (!keys.includes(v)) {
                            v = "???";
                            nodel = true;
                        }

                        let mores = findChildItem(rootElem, item.more);
                        mores.children().addClass("nodisplay");
                        
                        let more = findChildItem(mores, jqns(v));
                        if (more) {
                            more.removeClass("nodisplay");
                            
                            // TODO: else statement for custom things here
                            if (form[item.more].data[v]) {
                                if (item.more[0] == "_") {
                                    if (item.more[1] == "_") {
                                        // Load entries correctly if data isn't stored
                                        moreForms.push(form[item.more].data[v]);
                                        loadEntries(level+1, more, data, form[item.more].data[v], false);
                                    } else {
                                        // I don't need to deal with this case right now.
                                        console.log("WARNING! I SHOULD NOT RUN! IF YOU SEE THIS THE EDITOR FAILED!");
                                    }
                                } else {
                                    if (!data[item.more]) data[item.more] = {};
                                    loadEntries(level+1, more, data[item.more][v], form[item.more].data[v], true);
                                }
                            }
                        }
                    }
                    if (v != "???" && v != " " && data[itemID] !== v) {
                        data[itemID] = v;
                    }
                    if (v) elem.val(v);
                    break;
                case "ace":
                    if (data[itemID] === undefined) {
                        ace.edit(elem.attr("id")).setValue("", -1);
                    } else {
                        ace.edit(elem.attr("id")).setValue(JSON.stringify(v, null, 4), -1);
                    }
                    break;
                case "multi":
                    // Because some people thought it would be cool to have multiple valid types for the same key. Thanks.
                    nodel = true;
                    let t = typeof(v);
                    if (Array.isArray(v)) t = "list";

                    let j = null;
                    let tt = null;
                    if (v !== null && v !== undefined) {
                        for (let k = 0; k < item.types.length; k++) {
                            tt = item.types[k];
                            if (
                                tt == t ||
                                t == "object" && (tt == "sub" && Object.keys(v).length || tt == "info") ||
                                t == "string" && (tt == "ns" || tt == "text" || tt == "textarea") ||
                                t == "number" && (tt == "double" || tt == "int") ||
                                t == "boolean" && tt == "checkbox"
                            ) {
                                j = k;
                                break;
                            }
                        }
                    }

                    elem.find(">div").addClass("nodisplay");
                    
                    let sel = elem.find(">select");
                    let name = item.options[j || 0];
                    let div = elem.find(">.multi-"+name);

                    sel.val(name);
                    div.removeClass("nodisplay");
                    if (j != null) {
                        if (tt == "info") {
                        } else if (tt == "sub") {
                            loadEntries(level+1, div, v, form[itemID].data[j], true);
                        } else {
                            if (v === undefined) v = "";
                            div.find(">._"+itemID).val(v);
                        }
                    } else {
                        // FIXME: Hopefully no issues here...
                        div.find(">._"+itemID).val("");
                    }
                    break;
                case "id": // ID values are not based on the dictionary, but rather a unique value.
                    if (id !== undefined) elem.val(id); // IDs are only updated if provided.
                    break;
                case "ns": // Make sure ns value is nsed
                    if (v) v = ns(v);
                    elem.val(v);
                    break;
                case "image":
                    elem.prevAll("img").first().attr("src", v);
                    break;
                case "checkbox":
                    if (v === "") v = false;
                    if (data[itemID] === undefined) data[itemID] = v;
                    elem.prop("checked", v);
                    break;
                case "bool":
                    // JQuery can't set the value on this properly
                    if (data[itemID] === undefined) {
                        elem.get(0).value = "unspecified";
                    } else {
                        elem.get(0).value = String(v);
                    }
                    break;
                case "textlist":
                    if (Array.isArray(v)) v = v.join("\n");
                default:
                    // Every other element
                    elem.val(v);
                    break;
            }

            // Make sure data is stored in the right format regardless.
            if (["dict", "sub", "list", "more", "ace", "textlist", "multi"].indexOf(item.type) == -1) {
                if (item.type != "options" || (v != "???" && v != " ")) {
                    if (data[itemID] !== undefined && data[itemID] !== v) data[itemID] = v;
                }
            }
        }

        // Trash unused data
        if (!nodel && del && typeof(data) === "object") {
            loopouter:
            for (const key of Object.keys(data)) {
                if (!(key in form)) {
                    for (const mform of moreForms) {
                        if (key in mform) continue loopouter;
                    }
                    // Data not found in form, so trash it
                    delete data[key];
                }
            }
            save();
        }
    }
}

// Function to generate and insert html into the page based on the dictionary
function insertForm(loc, header, form, datapath, level=0) {
    if (header) {
        loc.append(header);
    }
    for (const [itemID, item] of Object.entries(form)) {
        // Get element id from id and key
        let elemID = datapath + "-" + itemID;
        let panelID = datapath + "--" + itemID;
        // Append Div for item and description
        if (item.name) {
            // Make name link if need be
            let linkname = item.name;
            if (item.link) linkname = `<a href='${item.link}'>${linkname}</a>`;
            
            if (item.desc) {
                loc.append(`<span class="iitem" title="${item.desc}">${linkname}:</span>`);
            } else {
                loc.append(`<span class="iitem">${linkname}:</span>`);
            }
        }
        
        // Get default value if available
        let itemval;
        if (item.default) {
            itemval = item.default;
        } else {
            itemval = "";
        }
        
        // Append custom input dependent on the type
        let cs = "panel";
        let pnl;
        switch (item.type) {
            case "info":
                cs = "panel";
                if (level % 2 == 1) {
                    cs = "panel panel-dark";
                }
                loc.append(`<div class="${cs}">${item.info}</div><br>`);
                break;
            case "options":
                let items = [];
                items.push(`<select name="${itemID}" class="ientry _${itemID}" onchange='insertData("${itemID}", "${item.type}", this, "${item.more || ""}")' value="${itemval}">`);
                for (const v of (item.options || Object.keys(form[item.more].data))) {
                    items.push(`<option value="${v}">${v}</option>`);
                }
                items.push("</select>");
                loc.append(items.join(""));
                break;
            case "more":
                loc.append(`<div name="${itemID}" class="iblock _${itemID}"></div><br>`);
                pnl = findItem(panelID);
                
                // Creating multiple panels is necessary
                for (const [option, odata] of Object.entries(item.data)) {
                    let jqop = jqns(option);
                    // Create panel
                    pnl.append(`<div name="${jqop}" class="nodisplay _${jqop}"></div>`);
                    let spnl = findItem(panelID, jqop);

                    // Then call recursively
                    insertForm(spnl, "", odata, panelID+"--"+jqop, level);
                }
                
                // Display the first one.
                findItem(panelID, jqns(Object.keys(item.data)[0])).removeClass("nodisplay");
                break;
            case "multi": // I personally find it dumb that this is required
                if (item.panel) {
                    cs = "panel ";
                    if (level % 2 == 1) {
                        cs = "panel panel-dark ";
                    }
                } else cs = "";

                panelID = datapath + "--_" + itemID;
                loc.append(`<div name="_${itemID}" class="${cs}iblock __${itemID}"><select class="mb2" onchange='changeMulti(this)'></select></div>`);
                pnl = findItem(panelID);
                let select = pnl.find(">select");

                for (let i = 0; i < item.options.length; i++) {
                    let mName = item.options[i];
                    let mType = item.types[i];
                    select = select.append(`<option value="${mName}">${mName}</option>`);
                    if (item.data[i]) {
                        if (item.hide) {
                            // It do be a subpanel though! In order to handle mojang's greed for recursion, it needs a show button
                            pnl = pnl.append(`<div ttype="${mType}" llevel="${level+1}" name="${itemID}" class="nodisplay iblock _${itemID} multi-${mName}"><button class="sbutton" onclick='insertPanel(this)'>+</button></div>`);
                        } else {
                            // Load just like how more does, without the show button.
                            pnl = pnl.append(`<div name="${itemID}" class="nodisplay _${itemID} multi-${mName}"></div>`);
                            let elem = pnl.find(">._"+itemID);
                            insertForm(elem, "", item.data[i], panelID+"--"+itemID, level);
                        }
                    } else {
                        pnl = pnl.append(`<div name="_${mName}" class="nodisplay iblock __${mName} multi-${mName}"></div>`);
                        let elem = pnl.find(">.__"+mName);
                        insertSimple(elem, mType, itemID, level);
                    }
                }

                select.after("<br>");
                break;
            case "sub":
            case "list":
                // If it's a list or sub, it has a panel, and we wait to create fields for it until the user expands it.
                // If we didn't do this, we would have infinite recursion problems.
                let lID = itemID;
                if (item.type === "list") {
                    lID = "-" + itemID;
                    panelID = datapath + "---" + itemID;
                }
                
                cs = "panel";
                if (level % 2 == 1) {
                    cs = "panel panel-dark";
                }
                if (level > 100) {
                    console.log("Recursion depth max reached! Cannot make " + itemID);
                    continue;
                }
                
                loc.append(`<div ttype="${item.type}" llevel=${level+1} name="${lID}" class="${cs} _${lID}"><button class="sbutton" onclick='insertPanel(this)'>+</button></div>`);
                break;
            default:
                // Other values are simple and inserted simply
                insertSimple(loc, item.type, itemID, level, itemval);
        }
        if (item.name) loc.append("<br>\n\n");
    }
};

function insertSimple(loc, type, itemID, level, itemval="") {
    switch (type) {
        case "main":
        case "ns":
        case "id":
        case "text":
            loc.append(`<input name="${itemID}" class="ientry _${itemID}" onchange='insertData("${itemID}", "${type}", this)' value="${itemval}">`);
            break;
        case "int":
            loc.append(`<input name="${itemID}" class="ientry _${itemID}" type="number" onchange='insertData("${itemID}", "${type}", this)' value="${itemval}">`);
            break;
        case "double":
            loc.append(`<input name="${itemID}" class="ientry _${itemID}" type="number" step="0.0001" onchange='insertData("${itemID}", "${type}", this)' value="${itemval}">`);
            break;
        case "checkbox":
            loc.append(`<input name="${itemID}" class="ientry _${itemID}" type="checkbox" onchange='insertData("${itemID}", "${type}", this)' value="${itemval}">`);
            break;
        case "bool":
            loc.append(`<select name="${itemID}" class="ientry _${itemID}" onchange='insertData("${itemID}", "${type}", this)' value="unspecified"><option value="unspecified">unspecified</option><option value="true">true</option><option value="false">false</option></select>`)
            break;
        case "image":
            loc.append(`<img class="i_${itemID}" src=""><br><div class="iitem"></div><button onclick='insertData("${itemID}", "cimage", this)'>Clear</button><input name="${itemID}" class="ientry _${itemID}" type="file" onchange='insertData("${itemID}", "${type}", this)' value="${itemval}" accept="image/*">`);
            break;
        case "ace":
            loc.append(`<div id="ace-${xn}" name="${itemID}" class="iblock _${itemID} ace ace-small" onfocusout="insertData('${itemID}', '${type}', this, ${xn})"></div>`);
            setupAce("ace-"+xn, "ace/mode/json");
            xn++;
            break;
        case "textarea":
            loc.append(`<textarea name="${itemID}" class="ientry _${itemID}" onchange='insertData("${itemID}", "${type}", this)'>${itemval}</textarea>`);
            break;
        case "textlist":
            loc.append(`<textarea name="${itemID}" class="ientry _${itemID} nowrap larger" onchange='insertData("${itemID}", "${type}", this)'>${itemval}</textarea>`);
            break;
    }
};

function insertPanel(btn) {
    "use strict";
    // Get important variables
    var pnl = $(btn.parentElement);
    var itemID = pnl.attr("name");
    var type = pnl.attr("ttype");
    var level = parseInt(pnl.attr("llevel"));

    // Create some variables
    var datapath = getPath(btn.parentElement);
    var elemID = datapath + "--" + itemID;
    var loc = locateData(elemID); // Populates data, is actually necessary
    save();
    
    // Change button to "hide"
    var sbtn = $(btn);
    sbtn.text("-");
    sbtn.attr("onclick", `removePanel(this)`);
    
    pnl.addClass("selectable");

    switch (type) {
        case "list": // Lists just need to have an add button added, as loadEntries handles the rest of it
            pnl.append(`<br><button level=${level} class="m zlist-button sbutton" onclick='addListItem(this)'>+</button><button class="m zlist-button sbutton" onclick='clearList(this, "${itemID.substring(1)}")'>C</button>`);
            break;
        case "sub":
            pnl.addClass("subop");
            insertForm(pnl, "<br>", locateForm(datapath, itemID), elemID, level, true);
            break;
        case "dict":
            // TODO: dictionary editor (I'mma wait to actually implement this)
            pnl.append('<div class="zdict"></div>')
            break;
    }
    
    // After inserting panel, load entries
    if (/*loc && */activeType != "help" && activeType != "raw") {
        if (type == "list") {
            loadEntries(level, pnl.parent(), locateData(datapath), locateForm(datapath)); // Load list's parent only.
        } else {
            loadEntries(level, pnl, loc, locateForm(datapath, itemID), true);
        }
    }
}
function removePanel(btn) {
    // Remove data from raw data
    var spath = getPath(btn).replace("-__-", ":").split("--");
    var key = spath[spath.length-1];
    if (key[0] == "-") key = key.substring(1);
    
    delete locateData(spath.slice(0, -1).join("--"))[key];
    save();
    
    // Remove html
    var pnl = $(btn.parentElement);
    pnl.removeClass("selectable");
    pnl.html(`<button class="sbutton" onclick='insertPanel(this)'>+</button>`);
}

var otherOptions = {};
// Ace functions
function saveOther() {
    if (activeType == "other" || activeType == "functions") {
        activeParent[activeUName] = otherEditor.getValue();
        save();
    }
}
function changeAutosave(value) {
    if (otherOptions.autosave) {
        window.clearInterval(otherOptions.autosave);
        otherOptions.autosave = null;
    }

    var v = parseInt(value)*1000;
    if (v) otherOptions.autosave = window.setInterval(saveOther, v);
}