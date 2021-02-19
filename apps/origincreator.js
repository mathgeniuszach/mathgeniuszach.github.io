// Function to normalize strings
function ns(str) {
    "use strict";
    return str.replace(/\s+/g, '_').replace(/[^\w:]+/g, '').toLowerCase();
}
// CSS selectors are dumb so this exists
function jqns(str) {
    "use strict";
    return ns(str).replace(/:/g, '-_-');
}

// Things to do when the document is done loading
$(document).ready(function() {
    insertForm($("#div-meta"), "<h2>pack - My Origins</h2>\n", forms.meta, "meta");
    insertForm($("#div-layer"), "<h2>layer - origins:origin</h2>\n", forms.layer, "layer");
    insertForm($("#div-origin"), "<h2>origin - New Origin</h2>\n", forms.origin, "origin");
    insertForm($("#div-power"), "<h2>power - New Power</h2>\n", forms.power, "power");
    
    $("#btn-up").click(itemUp);
    $("#btn-down").click(itemDown);
    
    $("#btn-delete").click(deleteItem);
    $("#btn-save").click(save);
    $("#btn-reset").click(resetPack);
    $("#btn-help").click(help);
    
    $("#btn-new-layer").click(newLayer);
    $("#btn-new-origin").click(newOrigin);
    $("#btn-new-power").click(newPower);
    
    $("#btn-import").click(importThing);
    $("#btn-datapack").click(exportDatapack);
    $("#btn-mod").click(exportMod);
    
    $("#btn-raw-data").click(openRawData);
    $("#btn-load-raw").click(loadRaw);
    $("#btn-reset-raw").click(resetRaw);
    
    var contentBox = $("#content-box");
    contentBox.on("change", selectContent);
    contentBox.on("focus", ensureSelect);
    
    // Load data if possible
    loadData(window.localStorage.getItem("origin-creator-data"));
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
    // Get screens
    fullscreen = s;
    [screen, subscreen] = splitScreen(s);
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
    
    // Load data into entry fields
    if (active) {
        loadEntries(screen, active, forms[screen], subscreen);
    }
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

// Save the webpage all into a cookie
function save() {
    "use strict";
    // 1000 days should be good enough
    window.localStorage.setItem("origin-creator-data", JSON.stringify(data));
}
// Reset the entire pack to default
function resetPack() {
    "use strict";
    window.localStorage.setItem("origin-creator-data", "");
    location.reload();
}
function help() {
    "use strict";
    changeScreen("help");
}

function newLayer() {
    "use strict";
    newItem("layer", {"replace": false, "origins": []});
}
function newOrigin() {
    "use strict";
    newItem("origin", {"name": "New Origin"}, "New Origin");
}
function newPower() {
    "use strict";
    newItem("power", {"name": "New Power"}, "New Power");
}

function importThing() {
    "use strict";
}
function exportDatapack() {
    "use strict";
}
function exportMod() {
    "use strict";
}

function openRawData() {
    "use strict";
    resetRaw();
    changeScreen("raw");
}
function loadRaw() {
    "use strict";
    var err = loadData($("#raw-data-textarea").val());
    if (err) {
        $("#raw-err").text("Error loading data: " + err);
    } else {
        $("#raw-err").text("Data loaded successfully.");
    }
}
function resetRaw() {
    "use strict";
    $("#raw-err").text("");
    $("#raw-data-textarea").val(JSON.stringify(data));
}
