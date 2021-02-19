// Data that pretty much stores everything
var data = {
    "help": null,
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
    for (const itemid in data["layer"]) {
        $("#layers-group").append(`<option class="ocitem" value="layer-${itemid}">${itemid}</option>`);
    }
    for (const itemid in data["origin"]) {
        $("#origins-group").append(`<option class="ocitem" value="origin-${itemid}">${itemid}</option>`);
    }
    for (const itemid in data["power"]) {
        $("#powers-group").append(`<option class="ocitem" value="power-${itemid}">${itemid}</option>`);
    }
    
    // Change the header in the Metadata
    $("#div-meta h2").text("pack - " + data["meta"]["name"]);
    $("#side-main-head").text(data["meta"]["name"]);

    // Save data to keep things in sync
    save();
}

function locateForm(datapath, id) {
    var spath = datapath.split("--");
    // Find starting location
    var formloc = forms[spath[0]];
    
    // Finish finding form location
    for (let i = 1; i < spath.length; i++) {
        let newFormLoc = formloc[spath[i].replace("-_-", ":").replace("-", "")];
        if (newFormLoc.type == "more") {
            let v = $("#"+spath.slice(0, i).join("--")+"-"+newFormLoc.parent).val();
            formloc = newFormLoc.data[v];
        } else {
            formloc = newFormLoc.data;
        }
    }
    return formloc[id].data;
}

function locateData(datapath) {
    var spath = datapath.split("--");
    // Find starting location
    var loc = data[spath[0]];
    if (spath[0] != "meta") { // Necessary because meta doesn't have named subitems
        loc = loc[subscreen];
    }
    // Finish finding location (here because maybe meta has a panel)
    for (let i = 1; i < spath.length; i++) {
        if (spath[i][0] === "-") { // Handle lists
            let newLoc = loc[spath[i].substring(1)];
            if (!newLoc) {
                loc = null;
                break;
            }
            // You got to figure out the selected element in order to get the right index
            // TODO: that
            loc = newLoc;
        } else {
            let newLoc = loc[spath[i]];
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
function insertData(datapath, key, type, item, extra) {
    "use strict";
    var loc = locateData(datapath);
    var v = item.value;
    var elem;
    
    // Options need happen regardless of whether or not loc exists
    if (type === "options") { // Options need to change the visible "more" panel
        if (loc) loc[key] = v;
        if (extra) {
            $("#"+datapath+"--"+extra+" > div").addClass("nodisplay")
            $("#"+datapath+"--"+extra+"-"+jqns(v)).removeClass("nodisplay");
            if (loc) delete loc[extra];
        }
        return;
    }
    if (!loc) return;
    
    switch (type) {
        case "main": // Main field needs to update the header and left panel side-main-head
            loc[key] = v;
            $("#side-main-head").text(v);
            $("#div-meta h2").text("pack - " + v);
            break;
        case "id": // IDs need to be handled in a particular way because they modify other elements.
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
                    
                    $("#i"+datapath+"-"+key).attr("src", output);
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
            $("#i"+datapath+"-"+key).attr("src", "");
            $("#"+datapath+"-"+key).val("");
            delete loc[key];
        case "checkbox":
            v = item.checked;
            loc[key] = v
            break;
        case "ns": // Normalized strings just need to be normalized
            v = ns(v);
            item.value = v;
            loc[key] = v;
            break;
        case "int":
            if (v) {
                v = Math.round(v);
                item.value = v;
            }
            loc[key] = v;
            break;
        default:
            loc[key] = v;
            break;
    }
    
    // Always gotta save that progress!
    save();
}

// Internal function called to load data from a dictionary into entries based on a form.
// +loadEntries(str rootid, dict data, dict form)
//    - rootid - First part of the ID of the html elements to insert into. It does not need to point to an existing element.
//    - data - Dictionary containing the values to insert into the form.
//    - form - Dictionary of a form containing the metadata of how to insert values.
//    - id - id of the dictionary, necessary for filling in "id" types.
function loadEntries(rootid, data, form, id) {
    "use strict";
    if (form) {
        for (const [itemID, item] of Object.entries(form)) {
            let elem = $("#" + rootid + "-" + itemID);
            switch (item.type) {
                case "list": // Fill in lists
                    break;
                case "sub": // Fill in sub-forms
                    break;
                case "dict": // AW no. At least not right now.
                    break;
                case "more": // more doesn't load anything on it's own. This is the job of options
                    break;
                case "options": // Load option and more
                    let v = data[itemID] || item.default || "";
                    elem.val(v);
                    // Load more
                    if (item.more) {
                        $(`#${rootid}--${item.more}-${jqns(v)}`).removeClass("nodisplay");
                        if (!data[item.more]) data[item.more] = {};
                        loadEntries(rootid+"--"+item.more, data[item.more], form[item.more].data[v]);
                    }
                    break;
                case "id": // ID values are not based on the dictionary, but rather a unique value.
                    elem.val(id || item.default);
                    break;
                case "image":
                    $("#i" + rootid + "-" + itemID).attr("src", data[itemID]);
                    break;
                case "checkbox":
                    elem.prop("checked", data[itemID]);
                default:
                    // Every other element
                    elem.val(data[itemID] || item.default || "");
                    break;
            }
        }
    }
}

// Function to generate and insert html into the page based on the dictionary
function insertForm(loc, header, form, datapath) {
    "use strict";
    if (header) {
        loc.append(header);
    }
    for (const [itemID, item] of Object.entries(form)) {
        // Get element id from id and key
        let elemID = datapath + "-" + itemID;
        // Append Div for item and description
        loc.append(`<span class="iitem" title="${item.desc}">${item.name}:</span>`);
        
        // Get default value if available
        let itemval;
        if (item.default) {
            itemval = item.default;
        } else {
            itemval = "";
        }
        
        // Append custom input dependent on the type
        switch (item.type) {
            case "main":
            case "ns":
            case "id":
            case "text":
                loc.append(`<input class="ientry" id="${elemID}" onchange='insertData("${datapath}", "${itemID}", "${item.type}", this)' value="${itemval}">`);
                break;
            case "int":
                loc.append(`<input class="ientry" type="number" id="${elemID}" onchange='insertData("${datapath}", "${itemID}", "${item.type}", this)' value="${itemval}">`);
                break;
            case "double":
                loc.append(`<input class="ientry" type="number" step="0.0001" id="${elemID}" onchange='insertData("${datapath}", "${itemID}", "${item.type}", this)' value="${itemval}">`);
                break;
            case "checkbox":
                loc.append(`<input class="ientry" type="checkbox" id="${elemID}" onchange='insertData("${datapath}", "${itemID}", "${item.type}", this)' value="${itemval}">`);
                break;
            case "image":
                loc.append(`<img id="i${elemID}" src=""><br><div class="iitem"></div><button onclick='insertData("${datapath}", "${itemID}", "cimage", this)'>Clear</button><input class="ientry" type="file" id="${elemID}" onchange='insertData("${datapath}", "${itemID}", "${item.type}", this)' value="${itemval}" accept="image/*">`);
                break;
            case "textarea":
                loc.append(`<textarea class="ientry" id="${elemID}" onchange='insertData("${datapath}", "${itemID}", "${item.type}", this)'>${itemval}</textarea>`);
                break;
            case "options":
                let items = [];
                items.push(`<select class="ientry" id="${elemID}" onchange='insertData("${datapath}", "${itemID}", "${item.type}", this, "${item.more || ""}")' value="${itemval}">`);
                for (const v of (item.options || Object.keys(form[item.more].data))) {
                    items.push(`<option value="${v}">${v}</option>`);
                }
                items.push("</select>");
                loc.append(items.join());
                break;
            default:
                // If it's not any of the above options, it has a panel, and we wait to create fields for it until the user expands it. If we didn't do this, we would have infinite recursion problems.
                elemID = datapath + "--" + itemID;
                
                if (item.type === "more") {
                    loc.append(`<div class="iblock" id="${elemID}"></div>`);
                    var pnl = $("#"+elemID);
                    
                    // Creating multiple panels is necessary
                    for (const [option, odata] of Object.entries(item.data)) {
                        let jqop = jqns(option);
                        // Create panel
                        pnl.append(`<div class="panel nodisplay" id="${elemID}-${jqop}"></div>`);
                        let spnl = $(`#${elemID}-${jqop}`);

                        // Then call recursively
                        insertForm(spnl, "", odata, elemID);
                    }
                } else {
                    if (item.type === "list") elemID = datapath + "---" + itemID;
                    
                    loc.append(`<div class="panel" id="${elemID}"><button onclick='insertPanel("${elemID}", "${datapath}", "${itemID}", "${item.type}")'>S</button></div>`);
                }
                
        }
        loc.append("<br>\n\n");
    }
};

function insertPanel(elemID, datapath, itemID, type) {
    "use strict";
    // Create some variables
    var pnl = $("#"+elemID);
    var formloc = locateForm(datapath, itemID);
    var loc = locateData(datapath);
    
    // Change button to "hide"
    var btn = pnl.find(">button");
    btn.text("H");
    btn.attr("onclick", `removePanel("${elemID}", "${datapath}", "${itemID}", "${type}")`);
    
    switch (type) {
        case "list":
            pnl.attr("id", elemID);

            pnl.append('<div class="zlist"><select size=7></select><div><button>+</button><button>-</button><button>˄</button><button>˅</button></div></div><br>');

            // Create Item sub-form
            insertForm(pnl, "", formloc, elemID);
            break;
        case "sub":
            pnl.addClass("subop");
            insertForm(pnl, "", formloc, elemID);
            break;
        case "dict":
            // TODO: dictionary editor (I'mma wait to actually implement this)
            pnl.append('<div class="zdict"></div>')
    }
    // After inserting panel, load entries
    if (loc) loadEntries(elemID, loc, formloc);
}
function removePanel(elemID, datapath, itemID, type) {
    $("#"+elemID).html(`<button onclick='insertPanel("${elemID}", "${datapath}", "${itemID}", "${type}")'>S</button>`);
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
function newItem(type, content, name) {
    "use strict";
    // Create name
    var i = genID(type);
    content.id = i;
    
    // Create item
    if (name) {
        content.name = name;
    }
    $("#" + type + "s-group").append(`<option class="ocitem" value="${type}-${i}">${i}</option>`);
    // Create item data
    data[type][i] = content;
    
    // Select this item in the list
    document.querySelector(`option[value="${type}-${i}"]`).selected = true;
    changeScreen(type + "-" + i);
    
    save();
}

// Delete item
function deleteItem() {
    "use strict";
    if (screen && screen != "help" && screen != "meta" && screen != "raw") {
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