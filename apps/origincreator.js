// Current list of TODOs:
// Setup customized dictionary editing system
// Setup built-in wiki and info
// Copy and paste system
// Support functions, tags, loot tables, and predicates.
// Use a url var to generate slightly different html that targets non-origin datapacks
// Improve import system so that conflicts are stated
// Replace content bar with jsTree and handle file movement
// Support other kinds of data that are unknown.
// Delete lingering references to aces that don't exist anymore.

// Possible performace improvements
// Transition things off of findItem to findChildItem
// Delete subpanels when switching option values
// Instead of loading the entire screen when something changes, load only one panel.

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
    "origin": {},
    "power": {},
    "tag": {},
    "recipe": {},
    "advancement": {},
    "function": {},
    "loot_table": {},
    "other": {}
};
var types = ["layer", "origin", "power", "tag", "other"]

// Some useful global variables
// Active JQuery screen
var active = null;
// Full text of the screen
var fullscreen = "help"
// Left side text of the screen (layer, origin, power, etc.)
var screen = "help";
// Right side text of the screen (user defined name)
var subscreen = null;
// Just a number to make unique things
var n = 0;
// Another number to make unique things
var xn = 0;
// ID
var pid = "myorigins";

var selected;

var rawEditor;
var iRawEditor;
var editOptions = {};

const urlArgs = new URLSearchParams(location.search);
// Save location
var saveLoc = urlArgs.get("save") || "";
var extDataLoc = decodeURIComponent(urlArgs.get("data") || "");

// Function to normalize strings
function ns(str) {
    "use strict";
    return str.replace(/\s+/g, '_').replace(/[^\w:./#_]+/g, '').toLowerCase();
}
// CSS selectors are dumb so this exists
function jqns(str) {
    "use strict";
    return ns(str).replace(/:/g, '-_-');
}

// Things to do when the document is done loading
$(document).ready(function() {
    block();
    
    insertForm($("#div-meta"), '<h2>pack - My Origins</h2>\n', forms.meta, "meta");
    for (const type of types) {
        insertForm($("#div-"+type), '<h2>' + type + ' - ?</h2><button class="btn-up">Up</button><button class="btn-down">Down</button><button class="btn-delete">Delete</button><br><br>\n', forms[type], type);
    }
    
    // Buttons for item movement
    $(".btn-up").click(itemUp);
    $(".btn-down").click(itemDown);
    $(".btn-delete").click(deleteItem);
    
    // Buttons for general overview
    $("#btn-save").click(save);
    $("#btn-reset").click(resetPack);
    $("#btn-help").click(help);
    
    // Import and export buttons
    $("#btn-import").click(function() {$("#ipt-import").click()});
    $("#ipt-import").change(importThing);
    $("#btn-datapack").click(exportDatapack);
    $("#btn-mod").click(exportMod);
    
    // Raw data buttons
    $("#btn-raw-data").click(openRawData);
    $("#btn-load-raw").click(loadRaw);
    $("#btn-reset-raw").click(resetRaw);
    $("#btn-download").click(downloadRaw);

    // Things for raw location
    $("#ipt-save-loc").val(saveLoc);
    $("#ipt-web-loc").val(extDataLoc);
    $("#btn-grab").click(grabData);

    // I raw data buttons
    $("#btn-toggle-i-raw").click(toggleIRaw);
    $("#btn-save-i-raw").click(saveIRaw);
    $("#btn-reset-i-raw").click(resetIRaw);
    
    // Document key handlers
    $(document).click(select);
    $(document).keydown(keyDown);

    // Content box (soon to be replaced)
    var contentBox = $("#content-box");
    contentBox.on("change", selectContent);
    contentBox.on("focus", ensureSelect);

    // Make ace raw content
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

// Function to split screen into screen and subscreen
function splitScreen(s) {
    "use strict";
    var loc = s.search("-");
    if (loc == -1) {
        return [s, null];
    } else {
        return [s.substring(0, loc), s.substring(loc+1)];
    }
}
// Function to change the screen and load any data into entry fields
function changeScreen(s) {
    "use strict";
    block();
    // Get screens
    fullscreen = s;
    [screen, subscreen] = splitScreen(s);
    if (subscreen == "+") {
        if (!data[screen]) data[screen] = {};
        // For new items
        switch (screen) {
            case "layer":
                newItem("layer", {"replace": false, "origins": []});
                break;
            default:
                newItem(screen);
                break;
        }
    } else {
        var activeElem = $("#div-"+screen)

        // Switch screen
        $(".content").addClass("nodisplay");
        activeElem.removeClass('nodisplay');

        // Set header and variables
        active = data[screen];
        if (subscreen) {
            active = active[subscreen];
            activeElem.find(">h2").text(screen + " - " + subscreen);
        }

        if (active) {
            // Load data into raw editor
            $("#div-i-raw").removeClass("nodisplay");
            resetIRaw();
            // Load data into entry fields
            loadEntries(0, activeElem, active, forms[screen], true, subscreen);
        }
    }
    resetRaw();
    unblock();
}
// Ensure that the proper item in the list box is shown (on refocus)
function ensureSelect() {
    "use strict";
    if (this.value && this.value != fullscreen) {
        changeScreen(this.value);
    }
}
// Item selected was changed, change screen
function selectContent() {
    "use strict";
    if (this.value) {
        changeScreen(this.value);
    } else {
        changeScreen("help");
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
    resetIRaw();
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
    if (screen == "raw") rawEditor.setValue(JSON.stringify(data, null, 4) || "", -1);
    else rawEditor.setValue("", -1);
    //$("#raw-data-textarea").val(JSON.stringify(data, null, 4));
}

function grabData() {
    saveLoc = $("#ipt-save-loc").val();
    extDataLoc = $("#ipt-web-loc").val();

    var loc = "?";
    if (saveLoc) loc += "save="+saveLoc+"&";
    if (extDataLoc) loc += "data="+encodeURIComponent(extDataLoc)+"&";
    
    if (saveLoc || extDataLoc) location.replace(loc);
    else location.replace("/apps/origincreator.html");
}

function toggleIRaw() {
    var elem = $("#div-i-raw-i");
    if (elem.hasClass("nodisplay")) {
        elem.removeClass("nodisplay");
    } else {
        elem.addClass("nodisplay");
    }
}
function saveIRaw() {
    try {
        var d = JSON.parse(iRawEditor.getValue())
        if (subscreen) {
            data[screen][subscreen] = d;
        } else {
            data[screen] = d;
        }
        changeScreen(fullscreen); // Not really hacky here tbh
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
                    navigator.clipboard.writeText(JSON.stringify(locateData(getPath(selected.get(0), true))));
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
                    navigator.clipboard.writeText(JSON.stringify(locateData(getPath(selected.get(0), true))));
                    select();
                    e.stopPropagation();
                    break;
                case 86:
                    // Paste
                    navigator.clipboard.readText().then(function(o) {
                        try {
                            // Get data
                            var d = JSON.parse(o);
                            var id = selected.attr("name");
                            if (!isNaN(id)) {
                                id = parseInt(id);
                            }
                            // Paste data
                            var path = getPath(selected.get(0));
                            locateData(path)[id] = d;
                            save();
                            // Load entries
                            changeScreen(fullscreen) // HACK: only loading list item is necessary
                        } finally {
                            select();
                        }
                    }, function() {});
                    e.stopPropagation();
                    break;
            }
        }
    }
}