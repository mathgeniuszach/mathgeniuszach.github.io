// Current list of TODOs:
// Setup built-in wiki and info
// Improve import system so that conflicts are stated
// Function programming language

// Possible performace improvements
// Transition things off of findItem to findChildItem
// Delete subpanels when switching option values
// Instead of loading the entire screen when something changes, load only one panel.

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
    return str.replace(/\s+/g, '_').replace(/[^\w:./#_]+/g, '').toLowerCase();
}
// CSS selectors are dumb so this exists
function jqns(str) {
    "use strict";
    return ns(str).replace(/:/g, '-__-');
}

// Things to do when the document is done loading
$(document).ready(function() {
    block();
    
    var metaDiv = $("#div-meta");
    insertForm(metaDiv, '<h2>pack - My Origins</h2>\n', forms.meta, "meta");
    for (const type of types) {
        metaDiv.after(`<div name="${type}" class="content nodisplay _${type}" id="div-${type}"></div>`);
        insertForm($("#div-"+type), '<h2>' + type + ' - ?</h2>\n', forms[type], type);
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
    $(document).click(select);
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
        $.get('https://api.allorigins.win/raw?url=' + encodeURIComponent(extDataLoc) + '&callback=?', function(data) {
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

// Function to change the screen and load any data into entry fields
function changeScreen(type, activeP, uname, path) {
    "use strict";
    // Store active data into globals
    activeType = type;
    activeParent = activeP;
    activeUName = uname;
    activePath = path;
    
    var activeElem = $("#div-"+type);

    // Switch screen
    $(".content").addClass("nodisplay");
    activeElem.removeClass('nodisplay');
    // Set header
    if (uname) activeElem.find(">h2").text(path + "/" + uname);

    // Do the rest
    if (type == "other" || type == "functions") {
        // Other panel is handled specially
        active = activeP[uname || type];
        $("#div-i-raw").addClass("nodisplay");
        // Gotta load in the other panel now
        otherEditor.setValue(active);
    } else if (uname || type == "meta") {
        active = activeP[uname || type];
        // Load data into raw editor
        $("#div-i-raw").removeClass("nodisplay");
        // Load data into entry fields
        loadEntries(0, activeElem, active, forms[type], true);
    } else {
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
        if (parents.length < 2) changeScreen("other", activeParent, node.text, activePath);
        else {
            var type = contentBox.get_node(parents[1]).text;
            if (types.indexOf(type) == -1) changeScreen("other", activeParent, node.text, activePath);
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
    
    if (saveLoc || extDataLoc) location.replace(loc);
    else location.replace("/apps/origincreator.html");
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
        changeScreen(activeType, activeParent, activeUName, activePath); // Not really hacky here tbh
        window.localStorage.setItem("origin-creator-data"+saveLoc, JSON.stringify(data));
        $("#i-raw-err").text("Data loaded successfully.");
    } catch (err) {
        $("#i-raw-err").text("Error loading data: " + err);
    }
}
function resetIRaw() {
    var v = JSON.stringify(active, null, 4) || "";
    iRawEditor.setValue(v, -1);
}

function keyDown(e) {
    if (selected) {
        if (e.keyCode == 46) {
            // Delete key
            if (isNaN(selected.attr("name"))) {
                removePanel(selected.find(">button").get(0));
            } else {
                removeListItem_(selected);
            }
            select();
            e.stopPropagation();
        }
        if (e.ctrlKey) {
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
        if (!isNaN(id)) {
            id = parseInt(id);
        }
        if (id[0] == "-") id = id.substring(1);
        // Paste data
        var path = getPath(selected.get(0));
        locateData(path)[id] = d;
        save();
        // Load entries
        changeScreen(activeType, activeParent, activeUName, activePath); // HACK: only loading the item itself is necessary
    } finally {
        select();
    }
}