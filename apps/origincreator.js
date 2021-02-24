// Current list of TODOs:
// Setup the rest of data
// Setup export system
// Setup customized dictionary editing system
// Setup built-in wiki

// Possible performace improvements
// Transition things off of findItem to findChildItem
// Make lists only load the panel instead of the whole page

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

const urlArgs = new URLSearchParams(location.search);
// Save location
var saveLoc = urlArgs.get("save") || "";
var extDataLoc = decodeURIComponent(urlArgs.get("data") || "");

// Function to normalize strings
function ns(str) {
    "use strict";
    return str.replace(/\s+/g, '_').replace(/[^\w:./]+/g, '').toLowerCase();
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
    insertForm($("#div-layer"), '<h2>layer - origins:origin</h2><button class="btn-up">Up</button><button class="btn-down">Down</button><button class="btn-delete">Delete</button><br><br>\n', forms.layer, "layer");
    insertForm($("#div-origin"), '<h2>origin - myorigins:origin</h2><button class="btn-up">Up</button><button class="btn-down">Down</button><button class="btn-delete">Delete</button><br><br>\n', forms.origin, "origin");
    insertForm($("#div-power"), '<h2>power - myorigins:power</h2><button class="btn-up">Up</button><button class="btn-down">Down</button><button class="btn-delete">Delete</button><br><br>\n', forms.power, "power");
    
    $(".btn-up").click(itemUp);
    $(".btn-down").click(itemDown);
    $(".btn-delete").click(deleteItem);
    
    $("#btn-save").click(save);
    $("#btn-reset").click(resetPack);
    $("#btn-help").click(help);
    
    $("#btn-import").click(function() {$("#ipt-import").click()});
    $("#ipt-import").change(importThing);
    $("#btn-datapack").click(exportDatapack);
    $("#btn-mod").click(exportMod);
    
    $("#btn-raw-data").click(openRawData);
    $("#btn-load-raw").click(loadRaw);
    $("#btn-reset-raw").click(resetRaw);
    $("#btn-download").click(downloadRaw);

    $("#ipt-save-loc").val(saveLoc);
    $("#ipt-web-loc").val(extDataLoc);
    $("#btn-grab").click(grabData);
    
    var contentBox = $("#content-box");
    contentBox.on("change", selectContent);
    contentBox.on("focus", ensureSelect);
    
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
    // Get screens
    fullscreen = s;
    [screen, subscreen] = splitScreen(s);
    if (subscreen == "+") {
        // For new items
        switch (screen) {
            case "layer":
                newItem("layer", {"replace": false, "origins": []});
                break;
            case "origin":
                newItem("origin");
                break;
            case "power":
                newItem("power");
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

        // Load data into entry fields
        if (active) {
            loadEntries(0, activeElem, active, forms[screen], true, subscreen);
        }
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

function load() {
    "use strict";
    loadData(window.localStorage.getItem("origin-creator-data"+saveLoc));
}
// Save the webpage all into a cookie
function save() {
    "use strict";
    window.localStorage.setItem("origin-creator-data"+saveLoc, JSON.stringify(data));
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
    $("#raw-data-textarea").val(JSON.stringify(data, null, 4));
}

function grabData() {
    saveLoc = $("#ipt-save-loc").val();
    extDataLoc = $("#ipt-web-loc").val();
    
    if (saveLoc && extDataLoc) location.replace("?save="+saveLoc+"&data="+encodeURIComponent(extDataLoc));
    else location.replace("/apps/origincreator.html");
}
