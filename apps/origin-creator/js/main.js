// Current list of TODOs:
// Improve import system so that conflicts are stated
// Function programming language

// Possible performace improvements
// Delete subpanels when switching option values
// Transition off of jQuery to basic DOMElements
// Instead of reloading everything when an options panel is updated, only load the necessary subpanel

// Some useful global variables
// Type of the currently active screen
var activeType = "help"
// Path of the currently selected item
var activeParent = null;
// Active data of the currently viewed element
var active = null;
// Uname active
var activeUName = null;
// Upath active
var activePath = null;
// Just a number to make unique things
var n = 0;
// Another number to make unique things
var xn = 0;
// ID
var pid = "mypack";

var clipedTree = false;

var dataClipboard;
var selected;
var contentBox;

var otherEditor;
var rawEditor;
var iRawEditor;
var editOptions = {};

// Function to normalize strings
function ns(str) {
    "use strict";
    if (typeof(str) == "string") {
        return str.replaceAll(/\s+/g, '_').replaceAll(/[^\w:./#_*]+/g, '').toLowerCase();
    } else {
        return "";
    }
}
// CSS selectors are dumb so this exists
function jqns(str) {
    "use strict";
    return ns(str).replaceAll(/:/g, '-__-');
}

// Things to do when the document is done loading
$(document).ready(function() {
    block();
    
    var metaDiv = $("#div-meta");
    insertForm(metaDiv, '<h2>pack - My Origins</h2>\n', forms.meta);
    for (const type of types) {
        metaDiv.after(`<div name="${type}" class="content nodisplay _${type}" id="div-${type}"></div>`);
        insertForm($("#div-"+type), '<h2>' + type + ' - ?</h2>\n', forms[type]);
    }
    
    // Buttons for general overview
    $("#btn-save").click(save);
    $("#btn-reset").click(resetPack);
    $("#btn-help").click(help);
    
    // Import and export buttons
    $("#btn-import").click(function() {$("#ipt-import").click()});
    $("#ipt-import").change(importThing);
    $("#btn-merge").click(function() {$("#ipt-merge").click()});
    $("#ipt-merge").change(mergeThing);
    $("#btn-datapack").click(exportDatapack);
    $("#btn-mod").click(exportMod);
    
    // Raw data buttons
    $("#btn-raw-data").click(openRawData);
    $("#btn-load-raw").click(loadRaw);
    $("#btn-reset-raw").click(resetRaw);
    $("#btn-download").click(downloadRaw);

    // Add thing buttons
    $("#btn-add-type").click(addTreeType);
    $("#btn-add-file").click(addTreeFile);

    // Things for raw location
    $("#ipt-save-loc").val(saveLoc);
    $("#ipt-web-loc").val(extDataLoc);
    $("#btn-grab").click(grabData);

    // I raw data buttons
    $("#btn-toggle-i-raw").click(toggleIRaw);
    $("#btn-save-i-raw").click(saveIRaw);
    $("#btn-reset-i-raw").click(resetIRaw);
    $("#btn-download-i-raw").click(downloadActiveRaw);
    
    // Document key handlers
    $(document).mousedown(select);
    $(document).keydown(keyDown);

    // If simple, remove references to origins related stuff
    if (simplified) {
        $(".non-simple").remove();
        for (let i of non_simple) delete data[non_simple];
    }

    // Clipboard
    dataClipboard =  window.localStorage.getItem("origin-creator-clip");
    clipedTree = window.localStorage.getItem("origin-creator-cliptree") === "true";

    // jsTree content box
    contentBox = $("#content-box").jstree(content_box);
    contentBox.bind("move_node.jstree", moveTreeItem);
    contentBox.bind("select_node.jstree", selectContent);

    // Make ace raw content
    otherEditor = setupAce("other-ace", "ace/mode/text");
    rawEditor = setupAce("raw-data-ace", "ace/mode/json");
    iRawEditor = setupAce("i-raw-data-ace", "ace/mode/json");
    
    // If external data is available, try to load that first. If not, just load normal data.
    if (extDataLoc) {
        // This website is very helpful
        $.get('//api.allorigins.win/raw?url=' + encodeURIComponent(extDataLoc) + '&callback=?', function(data) {
            try {
                loadData(data);
            } catch (err) {
                console.error(err);
                load();
            }
        }, "text")
        .fail(function() {load()})
        .always(function() {unblock()});
    } else {
        load();
        unblock();
    }
});

function reloadScreen() {
    changeScreen(activeType, activeParent, activeUName, activePath);
}

// Function to change the screen and load any data into entry fields
function changeScreen(type, activeP, uname, path) {
    "use strict";
    // Store active data into globals
    activeType = type;
    activeParent = activeP;
    activeUName = uname;
    activePath = path;

    var tname = uname || type;
    
    // Hide all screens
    $(".content").addClass("nodisplay");

    // Do the rest
    if (uname || type == "meta") {
        // It is not an other
        var activeElem;

        // Check if this is an other
        if (!types.includes(type) && type != "meta") {
            activeElem = $("#div-other");

            // Switch screen
            $("#div-other").removeClass('nodisplay');

            // Other panel is handled specially
            active = activeP[tname];
            if (typeof(active) != "string") {
                if (!active) active = "";
                else active = JSON.stringify(active);
                activeP[tname] = active;
            }

            // Gotta load in the other panel now
            // Also, set custom ace mode
            if (tname.endsWith(".json")) {
                otherEditor.session.setMode("ace/mode/json");
            } else if (tname.endsWith(".mcfunction") || type == "functions") {
                otherEditor.session.setMode("ace/mode/mcfunction");
            } else {
                otherEditor.session.setMode("ace/mode/text");
            }
            otherEditor.setValue(active, -1);
            // Show raw editor
            $("#div-i-raw").addClass("nodisplay");
        } else {
            activeElem = $("#div-"+type);
            
            active = activeP[tname];
            if (!active || typeof(active) != "object") {
                try {
                    active = JSON.parse(active);
                } catch (err) {}

                if (!active || typeof(active) != "object" || Array.isArray(active)) active = {};
                activeP[tname] = active;
            }
            
            // Load data into entry fields
            loadEntries(0, activeElem, active, forms[type], true);
            // Show raw editor
            $("#div-i-raw").removeClass("nodisplay");
        }
        // Switch screen
        activeElem.removeClass('nodisplay');
        // Set header
        if (uname) activeElem.find(">h2").text(path + "/" + uname);
    } else if (type == "raw" || type == "help") {
        // Switch screen
        $("#div-"+type).removeClass('nodisplay');
        // Set header
        if (uname) activeElem.find(">h2").text(path + "/" + uname);

        active = null;
        $("#div-i-raw").addClass("nodisplay");
    }
    
    resetRaw();
    resetIRaw();
}
// Item selected was changed, change screen
function selectContent(e, edata) {
    "use strict";
    contentBox = $("#content-box").jstree(true);
    var node = edata.node;

    if (node.type == "meta") changeScreen("meta", data);
    else {
        var parents = getParents(node);
        activeParent = findNodeData(node, true);
        activePath = parents.slice(1).map(n => contentBox.get_text(n)).join("/");
        if (parents.length < 2) changeScreen(type, activeParent, node.text, activePath, true);
        else {
            var type = contentBox.get_node(parents[1]).text;
            if (types.indexOf(type) == -1) changeScreen(type, activeParent, node.text, activePath, true);
            else changeScreen(type, activeParent, node.text, activePath);
        }
    }
}

function select(e) {
    if (selected) {
        selected.removeClass("panel-selected");
        selected = null;
    }

    if (e) {
        var tar = $(e.target);
        if (tar.hasClass("selectable")) {
            tar.addClass("panel-selected");
            selected = tar;
        }
    }
}

function load() {
    "use strict";
    loadData(window.localStorage.getItem("origin-creator-data"+saveLoc));
}
// Save the webpage all into a cookie
function save() {
    "use strict";
    window.localStorage.setItem("origin-creator-data"+saveLoc, JSON.stringify(data));
    window.localStorage.setItem("origin-creator-clip", dataClipboard);
    window.localStorage.setItem("origin-creator-cliptree", clipedTree);
    resetRaw();
    resetIRaw();
    //console.trace();
}
// Reset the entire pack to default
function resetPack() {
    "use strict";
    window.localStorage.removeItem("origin-creator-data"+saveLoc);
    location.reload();
}
function help() {
    "use strict";
    changeScreen("help");
}

function openRawData() {
    "use strict";
    changeScreen("raw");
}
function loadRaw() {
    "use strict";
    try {
        loadData(rawEditor.getValue());
        $("#raw-err").text("Data loaded successfully.");
    } catch (err) {
        $("#raw-err").text("Error loading data: " + err);
    }
}
function resetRaw() {
    "use strict";
    $("#raw-err").text("");
    if (activeType == "raw") rawEditor.setValue(JSON.stringify(data, null, 4) || "", -1);
    else rawEditor.setValue("", -1);
    //$("#raw-data-textarea").val(JSON.stringify(data, null, 4));
}

function grabData() {
    saveLoc = $("#ipt-save-loc").val();
    extDataLoc = $("#ipt-web-loc").val();

    var loc = "?";
    if (simplified) loc += "type=simple&";
    if (saveLoc) loc += "save="+saveLoc+"&";
    if (extDataLoc) loc += "data="+encodeURIComponent(extDataLoc)+"&";
    
    if (saveLoc || extDataLoc) location.replaceAll(loc);
    else location.replaceAll("/apps/origincreator.html");
}

function toggleIRaw() {
    var elem = $("#div-i-raw-i");
    if (elem.hasClass("nodisplay")) {
        resetIRaw();
        elem.removeClass("nodisplay");
    } else {
        elem.addClass("nodisplay");
    }
}
function saveIRaw() {
    try {
        var d = JSON.parse(iRawEditor.getValue());
        activeParent[activeUName] = d;
         // Not really hacky here tbh
        window.localStorage.setItem("origin-creator-data"+saveLoc, JSON.stringify(data));
        $("#i-raw-err").text("Data loaded successfully.");
    } catch (err) {
        $("#i-raw-err").text("Error loading data: " + err);
        console.error(err);
    }
}
function resetIRaw() {
    $("#i-raw-err").text("");
    var v = JSON.stringify(active, null, 4) || "";
    iRawEditor.setValue(v, -1);
}

function keyDown(e) {
    // Check if content box item is selected, and if so, do special things
    if (document.activeElement.classList.contains("jstree-anchor")) {
        node = contentBox.get_node(document.activeElement.parentElement);
        if (node) {
            if (e.keyCode == 46) {
                deleteNodeItem(node);
            } else if (e.ctrlKey) {
                switch (e.keyCode) {
                    case 88:
                        // Cut
                        cutNodeItem(node);
                        break;
                    case 67:
                        // Copy
                        copyNodeItem(node);
                        break;
                    //case 86:
                    //    // Paste
                    //    pasteNodeItem(node);
                    //    break;
                }
            }
        }
    } else if (selected) {
        if (e.keyCode == 46) {
            // Delete key
            if (isNaN(selected.attr("name"))) {
                removePanel(selected.find(">button").get(0));
            } else {
                removeListItem_(selected);
            }
            select();
            e.stopPropagation();
        } else if (e.ctrlKey) {
            switch (e.keyCode) {
                case 83: 
                    // Save
                    save();
                    e.stopPropagation();
                    break;
                case 88:
                    // Cut
                    // Copy first
                    dataClipboard = JSON.stringify(locateData(getPath(selected.get(0), true)));
                    clipedTree = false;
                    save();
                    //navigator.clipboard.writeText(dataClipboard);
                    // Then delete
                    if (isNaN(selected.attr("name"))) {
                        removePanel(selected.find(">button").get(0));
                    } else {
                        removeListItem_(selected);
                    }
                    // Then normal stuff
                    select();
                    e.stopPropagation();
                    break;
                case 67:
                    // Copy
                    dataClipboard = JSON.stringify(locateData(getPath(selected.get(0), true)));
                    clipedTree = false;
                    save();
                    //navigator.clipboard.writeText(dataClipboard);
                    select();
                    e.stopPropagation();
                    break;
                case 86:
                    // Paste
                    if (!clipedTree) loadClipboard(dataClipboard);
                    //navigator.clipboard.readText().then(function (o) {
                    //    loadClipboard(o);
                    //}, function() {
                    //    alert("Defaulting to backup clipboard (data will not persist on reload)");
                    //});
                    e.stopPropagation();
                    break;
            }
        }
    }
}
function loadClipboard(o) {
    try {
        var d = JSON.parse(o);
        var id = selected.attr("name");
        if (id[0] == "-") id = id.substring(1);
        // Paste data
        var path = getPath(selected.get(0));
        locateData(path)[id] = d;
        save();
        // Load entries
        reloadScreen(); // HACK: only loading the item itself is necessary
    } finally {
        select();
    }
}