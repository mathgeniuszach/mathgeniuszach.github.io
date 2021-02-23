// Data that pretty much stores everything
var data = {
    "meta": {
        "name": "My Origins",
        "id": "myorigins"
    },
    "layer": {
        "origins:origin": {
            "replace": false,
            "origins": []
        }
    },
    "origin": {
        
    },
    "power": {
        
    }
};

// Some useful global variables
// Active JQuery screen
var active = null;
// Full text of the screen
var fullscreen = "help"
// Left side text of the screen (layer, origin, power, etc.)
var screen = "help";
// Right side text of the screen (user defined name)
var subscreen = null;
// Just a number to make layers
var n = 0;
// ID
var pid = "myorigins";

// Loads dictionary into html (creating options as necessary)
function loadData(ocd) {
    "use strict";
    if (!ocd) {
        return "Couldn't find data to load.";
    }
    
    // Delete any lingering items
    $('.ocitem').remove();
    delete data["layer"]["origins:origin"];
    try {
        // Load into data
        data = JSON.parse(ocd);
    } catch (e) {
        console.log(e);
        return e.message;
    }

    // Create items in listbox
    let item = $("#layers-group>.newitem");
    for (const itemid in data["layer"]) {
        item.before(`<option class="ocitem" value="layer-${itemid}">${itemid}</option>`);
    }
    item = $("#origins-group>.newitem");
    for (const itemid in data["origin"]) {
        item.before(`<option class="ocitem" value="origin-${itemid}">${itemid}</option>`);
    }
    item = $("#powers-group>.newitem");
    for (const itemid in data["power"]) {
        item.before(`<option class="ocitem" value="power-${itemid}">${itemid}</option>`);
    }
    
    // Change the header in the Metadata
    $("#div-meta h2").text("pack - " + data["meta"]["name"]);
    $("#side-main-head").text(data["meta"]["name"]);

    // Save data to keep things in sync
    save();
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
    return $("._"+datapaths.join(">._").replace(/--/g, ">._").replace(":", "-_-"));
}
function findChildItem(parent, ...datapaths) {
    return parent.find(">._"+datapaths.join(">._").replace(/--/g, ">._").replace(":", "-_-"))
}

function locateForm(datapath, id) {
    //console.log(datapath);
    var spath = datapath.split("--");
    // Find starting location
    var formloc = forms[spath[0]];
    
    // Finish finding form location
    for (let i = 1; i < spath.length; i++) {
        let path = spath[i].replace("-_-", ":");
        if (path[0] == "-") path = path.substring(1);
        
        if (!isNaN(path)) continue;
        
        //console.log(spath[i], formloc);
        let newFormLoc = formloc[path];
        if (!newFormLoc) continue;
        if (newFormLoc.type == "more") {
            let v = spath[i+1].replace("-_-", ":");
            //if (!v) findItem(spath.slice(0, i).join("--"), newFormLoc.parent).val();
            formloc = newFormLoc.data[v];
            i++;
        } else {
            formloc = newFormLoc.data;
        }
    }
    if (id != undefined) {
        var pid = id;
        if (id[0] == "-") pid = id.substring(1);
        
        if (!formloc[pid]) return null;
        else return formloc[pid].data;
    }
    else return formloc;
}

function locateData(datapath, nosub) {
    var spath = datapath.replace("-_-", ":").split("--");
    // Find starting location
    var loc = data[spath[0]];
    if (spath[0] != "meta") { // Necessary because meta doesn't have named subitems
        loc = loc[subscreen];
    }
    // Finish finding location (here because maybe meta has a panel)
    for (let i = 1; i < spath.length; i++) {
        if (spath[i][0] === "_") { // Skip things that don't want to be stored
            i++;
        } else if (spath[i][0] === "-") { // Handle lists
            let newLoc = loc[spath[i].substring(1)];
            // If the list doesn't exist, it needs to be created
            if (!newLoc) {
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
                
                loc = newLoc[index];
            }
        } else {
            let newLoc = loc[spath[i]];
            // If the location doesn't exist, it needs to be created
            if (!newLoc) {
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
    var elem;
    
    // Options need happen regardless of whether or not loc exists
    if (type === "options") { // Options need to change the visible "more" panel
        if (loc) loc[key] = v;
        if (extra) {
            findItem(datapath, extra).find(">div").addClass("nodisplay")
            findItem(datapath, extra, jqns(v)).removeClass("nodisplay");
            changeScreen(fullscreen); // HACK: Only real way I can think of doing it
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
        case "main": // Main field needs to update the header and left panel side-main-head
            loc[key] = v;
            $("#side-main-head").text(v);
            $("#div-meta h2").text("pack - " + v);
            break;
        case "id": // IDs need to be handled in a particular way because they unique define the subscreen.
            // Start by getting normalized id
            v = ns(v);
            // Make sure the id is unique
            while (v in data[screen]) v += "_";
            item.value = v;
            // Then move data to the right place
            data[screen][v] = loc;
            delete data[screen][subscreen];
            // Update html
            $("#div-" + screen + " h2").text(screen + " - " + v); 
            elem = $(`option[value="${screen}-${subscreen}"]`);
            elem.attr("value", screen + "-" + v);
            elem.text(v);
            // Finally, update screen
            subscreen = v;
            fullscreen = screen+"-"+subscreen;
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
            reader.readAsDataURL(item.files[0]);
            break;
        case "cimage": // For clearing images
            findItem(datapath).find(">.i_"+key).attr("src", "");
            findItem(datapath, key).val("");
            delete loc[key];
        case "checkbox":
            v = item.checked;
            loc[key] = v
            break;
        case "ns": // Normalized strings just need to be normalized
            if (v == "") {
                delete loc[key];
            } else {
                v = ns(v);
                item.value = v;
                loc[key] = v;
            }
            break;
        case "int":
            if (v == "") {
                delete loc[key];
            } else {
                v = Math.round(v);
                item.value = v;
                loc[key] = v;
            }
            break;
        default:
            if (v == "") {
                delete loc[key];
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
//    - rootid - First part of the ID of the html elements to insert into. It does not need to point to an existing element.
//    - data - Dictionary containing the values to insert into the form, and to clean.
//    - form - Dictionary of a form containing the metadata of how to insert values.
//    - id - id of the dictionary, necessary for filling in "id" types.
function loadEntries(rootElem, data, form, del, id) {
    "use strict";
    if (data && form) {
        var moreForms = [];

        // Load data
        for (const [itemID, item] of Object.entries(form)) {
            let v = data[itemID] || item.default || "";
            if (itemID.length > 1) {
                if (!data[itemID] && item.default) data[itemID] = v;
            } else { // Yes this is hacky and no I don't care
                if (typeof(data) == "object") {
                    v = item.default || "";
                } else {
                    v = data || item.default || "";
                }
            }
            
            // Spaghetti code is TIGHT!
            let elem = findChildItem(rootElem, itemID);
            if (item.type == "list") {
                elem = findChildItem(rootElem, "-"+itemID);
            }

            // Make sure subpanels are expanded or hidden as needed
            if (item.type == "list" || item.type == "sub" || item.type == "dict") {
                var c = elem.children();
                if (data[itemID] && c.length == 1 || (!data[itemID]) && c.length > 1) c.get(0).click();
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
                            for (let i = cl; i < list.length; i++) addListItem(btn);
                        } else if (cl > list.length) { // Remove elements if too many
                            for (let i = cl-1; i > list.length-1; i--) removeListItem_(elems.eq(i));
                        }

                        // Iterate over elements and load each individually
                        elems = elem.find(">div");
                        for (let i = 0; i < list.length; i++) {
                            loadEntries(elems.eq(i), list[i], form[itemID].data, true)
                        }
                    }
                    break;
                case "sub": // Fill in sub-forms
                    loadEntries(elem, data[itemID], form[itemID].data, true);
                    break;
                case "dict": // AW no. At least not right now.
                    break;
                case "more": // more doesn't load anything on it's own. This is the job of options
                    break;
                case "options": // Load option and more
                    // Load more
                    if (item.more) {
                        if (!v) {
                            v = Object.keys(form[item.more].data)[0];
                        }

                        let mores = findChildItem(rootElem, item.more);
                        mores.children().addClass("nodisplay");
                        
                        let more = findChildItem(mores, jqns(v));
                        if (more) {
                            more.removeClass("nodisplay");
                            
                            // TODO: else statement for custom things here
                            if (form[item.more].data[v]) {
                                if (item.more[0] == "_") {
                                    // Load entries correctly if data isn't stored moreForms.push(form[item.more].data[v])
                                    loadEntries(more, data, form[item.more].data[v], false);
                                } else {
                                    if (!data[item.more]) data[item.more] = {};
                                    loadEntries(more, data[item.more][v], form[item.more].data[v], true);
                                }
                            }
                        }
                    }
                    if (data[itemID] != v) data[itemID] = v;
                    if (v) elem.val(v);
                    break;
                case "id": // ID values are not based on the dictionary, but rather a unique value.
                    elem.val(id);
                    break;
                case "image":
                    elem.prevAll("img").first().attr("src", v);
                    break;
                case "checkbox":
                    elem.prop("checked", v || false);
                default:
                    // Every other element
                    elem.val(v);
                    break;
            }
        }

        // Trash unused data
        if (del && typeof(data) === "object") {
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
        // Append Div for item and description
        if (item.name) {
            loc.append(`<span class="iitem" title="${item.desc}">${item.name}:</span>`);
        }
        
        // Get default value if available
        let itemval;
        if (item.default) {
            itemval = item.default;
        } else {
            itemval = "";
        }
        
        // Append custom input dependent on the type
        switch (item.type) {
            case "info":
                loc.append(item.info);
                break;
            case "main":
            case "ns":
            case "id":
            case "text":
                loc.append(`<input name="${itemID}" class="ientry _${itemID}" onchange='insertData("${itemID}", "${item.type}", this)' value="${itemval}">`);
                break;
            case "int":
                loc.append(`<input name="${itemID}" class="ientry _${itemID}" type="number" onchange='insertData("${itemID}", "${item.type}", this)' value="${itemval}">`);
                break;
            case "double":
                loc.append(`<input name="${itemID}" class="ientry _${itemID}" type="number" step="0.0001" onchange='insertData("${itemID}", "${item.type}", this)' value="${itemval}">`);
                break;
            case "checkbox":
                loc.append(`<input name="${itemID}" class="ientry _${itemID}" type="checkbox" onchange='insertData("${itemID}", "${item.type}", this)' value="${itemval}">`);
                break;
            case "image":
                loc.append(`<img class="i_${itemID}" src=""><br><div class="iitem"></div><button onclick='insertData("${itemID}", "cimage", this)'>Clear</button><input name="${itemID}" class="ientry _${itemID}" type="file" onchange='insertData("${itemID}", "${item.type}", this)' value="${itemval}" accept="image/*">`);
                break;
            case "textarea":
                loc.append(`<textarea name="${itemID}" class="ientry _${itemID}" onchange='insertData("${itemID}", "${item.type}", this)'>${itemval}</textarea>`);
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
            default:
                // If it's not any of the above options, it has a panel, and we wait to create fields for it until the user expands it (except in more's case). If we didn't do this, we would have infinite recursion problems.
                elemID = datapath + "--" + itemID;
                
                if (item.type === "more") {
                    loc.append(`<div name="${itemID}" class="iblock _${itemID}"></div>`);
                    var pnl = findItem(elemID);
                    
                    // Creating multiple panels is necessary
                    for (const [option, odata] of Object.entries(item.data)) {
                        let jqop = jqns(option);
                        // Create panel
                        pnl.append(`<div name="${jqop}" class="nodisplay _${jqop}"></div>`);
                        let spnl = findItem(elemID, jqop);

                        // Then call recursively
                        insertForm(spnl, "", odata, elemID+"--"+jqop, level);
                    }
                    
                    // Display the first one.
                    findItem(elemID, jqns(Object.keys(item.data)[0])).removeClass("nodisplay");
                } else {
                    let lID = itemID;
                    if (item.type === "list") {
                        lID = "-" + itemID;
                        elemID = datapath + "---" + itemID;
                    }
                    
                    let cs = "panel";
                    if (level % 2 == 1) {
                        cs = "panel panel-dark";
                    }
                    if (level > 100) {
                        console.log("Recursion depth max reached! Cannot make " + itemID);
                        continue;
                    }
                    
                    // FIXME: I'm more comfortable just letting everything be hidden for now. No need to deal with the other issues right now.
                    //if (item.hidden) { // protect against infinite recursion in the laziest way possible
                        loc.append(`<div name="${lID}" class="${cs} _${lID}"><button class="sbutton" onclick='insertPanel(this, "${lID}", "${item.type}", ${level+1})'>+</button></div>`);
                    /*} else {
                        loc.append(`<div name="${lID}" class="${cs} _${lID}"><button class="sbutton" onclick='removePanel(this, "${lID}", "${item.type}", ${level+1})'>-</button></div>`);
                    
                        var pnl = findItem(elemID);
                        switch (item.type) {
                            case "list": // Lists just need to have an add button added, as loadEntries handles the rest of it
                                pnl.append(`<br><button level=${level+1} class="m zlist-button sbutton" onclick='addListItem(this)'>+</button><button class="m zlist-button sbutton" onclick='clearList(this, "${itemID}")'>C</button>`);
                                break;
                            case "sub":
                                pnl.addClass("subop");
                                pnl.append("<br>")
                                insertForm(pnl, "", item.data, elemID, level+1);
                                break;
                            case "dict":
                                // TODO: dictionary editor (I'mma wait to actually implement this)
                                pnl.append('<div class="zdict"></div>');
                        }
                    }*/
                }
                
        }
        if (item.name) loc.append("<br>\n\n");
    }
};

function insertPanel(btn, itemID, type, level) {
    "use strict";
    // Create some variables
    var datapath = getPath(btn.parentElement);
    var elemID = datapath + "--" + itemID;
    var loc = locateData(elemID); // Populates data, is actually necessary
    var pnl = findItem(datapath, itemID);
    
    // Change button to "hide"
    var sbtn = pnl.find(">button");
    sbtn.text("-");
    sbtn.attr("onclick", `removePanel(this, "${itemID}", "${type}", ${level})`);
    
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
    if (/*loc && */subscreen != "help" && subscreen != "raw") {
        //loadEntries(pnl, loc, locateForm(datapath, itemID));
        changeScreen(fullscreen); // HACK: This is just laziness, loading just the changed panel is all that's necessary.
    }
}
function removePanel(btn, itemID, type, level) {
    // Remove data from raw data
    var spath = getPath(btn).replace("-_-", ":").split("--");
    var key = spath[spath.length-1];
    if (key[0] == "-") key = key.substring(1);
    
    delete locateData(spath.slice(0, -1).join("--"))[key];
    
    // Remove html
    $(btn.parentElement).html(`<button class="sbutton" onclick='insertPanel(this, "${itemID}", "${type}", ${level})'>+</button>`);
}

// Generate a unique id of a layer, origin, or power based on the type and n.
function genID(type) {
    "use strict";
    var l;
    do {
        l = pid + ":" + type + n;
        n++;
    } while (l in data[type]);
    return l;
}
// Create a new item
function newItem(type, content) {
    "use strict";
    // Create name
    var i = genID(type);
    
    // Create item
    $("#" + type + "s-group>.newitem").before(`<option class="ocitem" value="${type}-${i}">${i}</option>`);
    // Create item data
    data[type][i] = content || {};
    save();
    
    // Select this item in the list
    document.querySelector(`option[value="${type}-${i}"]`).selected = true;
    changeScreen(type + "-" + i);
}

// Delete item
function deleteItem() {
    "use strict";
    if (screen && screen != "help" && screen != "meta" && screen != "raw" && subscreen != "+") {
        // Delete from data
        delete data[screen][subscreen];
        // Delete from content box
        $('option[value="' + fullscreen + '"]').remove();
        // Change screen
        changeScreen("help");
        
        save();
    }
}

// Move item up
function itemUp() {
    "use strict";
    if (screen && screen != "help" && screen != "meta" && screen != "raw") {
        // Value
        var val = document.getElementById("content-box").value;
        
        if (val) {
            // Find key location
            var subdata = data[screen];
            var keys = Object.keys(subdata);
            var i = keys.indexOf(splitScreen(val)[1]);

            if (i > 0) {
                // Swap key with previous in keys array
                [keys[i-1], keys[i]] = [keys[i], keys[i-1]];

                // Swap option with previous in content box
                var elems = $("#"+screen+"s-group option");
                swapNodes(elems.get(i-1), elems.get(i))

                // Convert keys back into data
                var newData = {}
                for (let key of keys) {
                    newData[key] = subdata[key];
                }
                data[screen] = newData;
            }
            
            save();
        }
    }
}

// Move item down
function itemDown() {
    "use strict";
    if (screen && screen != "help" && screen != "meta" && screen != "raw") {
        // Value
        var val = document.getElementById("content-box").value;
        
        if (val) {
            // Find key location
            var subdata = data[screen];
            var keys = Object.keys(subdata);
            var i = keys.indexOf(splitScreen(val)[1]);

            if (i !== -1 && i < keys.length-1) {
                // Swap key with previous in keys array
                [keys[i], keys[i+1]] = [keys[i+1], keys[i]];

                // Swap option with previous in content box
                var elems = $("#"+screen+"s-group option");
                swapNodes(elems.get(i), elems.get(i+1))

                // Convert keys back into data
                var newData = {}
                for (let key of keys) {
                    newData[key] = subdata[key];
                }
                data[screen] = newData;
            }
            
            save();
        }
    }
}