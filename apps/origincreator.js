var powerTypes = [
    "origins:simple",
    "origins:toggle",
    "origins:attribute",
    "origins:conditioned_attribute",
    "origins:burn",
    "origins:cooldown",
    "origins:effect_immunity",
    "origins:elytra_flight",
    "origins:entity_group",
    "origins:exhaust",
    "origins:fire_projectile",
    "origins:inventory",
    "origins:invisibility",
    "origins:invulnerability",
    "origins:launch",
    "origins:model_color",
    "origins:modify_break_speed",
    "origins:modify_damage_dealt",
    "origins:modify_damage_taken",
    "origins:modify_exhaustion",
    "origins:modify_harvest",
    "origins:modify_jump",
    "origins:modify_swim_speed",
    "origins:modify_lava_speed",
    "origins:modify_player_spawn",
    "origins:night_vision",
    "origins:particle",
    "origins:phasing",
    "origins:prevent_item_use",
    "origins:prevent_sleep",
    "origins:restrict_armor",
    "origins:conditioned_restrict_armor",
    "origins:stacking_status_effect",
    "origins:toggle_night_vision",
    "origins:damage_over_time",
    "origins:swimming",
    "origins:fire_immunity",
    "origins:lava_vision",
    "origins:active_self",
    "origins:action_over_time",
    "origins:self_action_when_hit",
    "origins:attacker_action_when_hit",
    "origins:self_action_on_hit",
    "origins:target_action_on_hit",
    "origins:starting_equipment",
    "origins:action_on_callback",
    "origins:walk_on_fluid",
    "origins:shader",
    "origins:shaking",
    "origins:resource",
    "origins:modify_food",
    "origins:modify_xp_gain"
];
var pConditions = [
    "NONE",
    "origins:or",
    "origins:and",
    "origins:block_collision",
    "origins:brightness",
    "origins:daytime",
    "origins:fall_flying",
    "origins:exposed_to_sun",
    "origins:exposed_to_sky",
    "origins:in_rain",
    "origins:invisible",
    "origins:on_fire",
    "origins:sneaking",
    "origins:sprinting",
    "origins:power_active",
    "origins:status_effect",
    "origins:submerged_in",
    "origins:fluid_height",
    "origins:origin",
    "origins:power",
    "origins:using_effective_tool",
    "origins:food_level",
    "origins:saturation_level",
    "origins:on_block",
    "origins:equipped_item",
    "origins:attribute",
    "origins:swimming",
    "origins:resource",
    "origins:air",
    "origins:in_block",
    "origins:block_in_radius",
    "origins:dimension",
    "origins:biome",
    "origins:xp_levels",
    "origins:xp_points",
    "origins:health",
    "origins:relative_health"
];

var forms = {
    "meta": {
        "icon": {
            "name": "Icon",
            "type": "file",
            "desc": "Icon to use in for your pack. It will appear in the mod or datapack."
        },
        "name": {
            "name": "Name",
            "type": "text",
            "desc": "The display name of your pack. It will be used in the mod title or datapack name."
        },
        "id": {
            "name": "Mod ID",
            "type": "text",
            "desc": "If your work is being exported to a mod, you can use this to specify a mod id. If not specified, it will be based on the display name."
        },
        "authors": {
            "name": "Authors",
            "type": "text",
            "desc": "Comma-separated list of authors. Authors will be trimmed of spaces."
        },
        "version": {
            "name": "Version",
            "type": "text",
            "desc": "Version number of your pack."
        },
        "description": {
            "name": "Description",
            "type": "textarea",
            "desc": "Description of your pack for use in a mod."
        }
    },
    "layer": {
        "id": {
            "name": "ID",
            "type": "text",
            "desc": "Namespaced ID of the layer. Use '/'s to define folders."
        },
        "replace": {
            "name": "Replace",
            "type": "checkbox",
            "desc": "Whether or not to replace an already existing layer in another pack."
        },
        "origins": {
            "name": "Origins",
            "type": "list-origin-id",
            "desc": "Origins to include in this layer."
        }
    },
    "origin": {
        "name": {
            "name": "Name",
            "type": "text",
            "desc": "When defined, this is the translation key (or literal text) that will be used as the name of the origin, instead of the default generated one."
        },
        "id": {
            "name": "ID",
            "type": "text",
            "desc": "Namespaced ID of the origin. Use '/'s to define folders.&#013;If not specified, it will be based on the display name."
        },
        "description": {
            "name": "Description",
            "type": "textarea",
            "desc": "When defined, this is the translation key (or literal text) that will be used as the description of the origin, instead of the default generated one."
        },
        "icon": {
            "name": "Icon Item",
            "type": "text",
            "desc": "The item ID of the item to use as the icon for this origin in the origin screen."
        },
        "impact": {
            "name": "Impact",
            "type": "number",
            "desc": "The impact value of the origin, where 0 = none, 1 = low, 2 = medium, 3 = high."
        },
        "order": {
            "name": "Order",
            "type": "number",
            "desc": "In the origin screen, origins are sorted first by impact, and second by this order value, where lower values come first."
        },
        "powers": {
            "name": "Powers",
            "type": "list-power-id",
            "desc": "A list of powers which this origin should have."
        },
        "loading_priority": {
            "name": "Load Priority",
            "type": "number",
            "desc": "Origins with higher loading priority override origins registered under the same ID with a lower loading priority.&#013;Use a value greater than 0 if you want to override origins added by the mod itself."
        },
        "unchoosable": {
            "name": "Unchoosable",
            "type": "checkbox",
            "desc": "If this is set to true, the origin will not be shown in the origin selection screen and cannot be chosen."
        },
        "upgrades": {
            "name": "Upgrades",
            "type": "list-upgrade",
            "desc": "Defines origins this origin will change into when an advancement is reached by the player."
        }
    },
    "power": {
        "name": {
            "name": "Name",
            "type": "text",
            "desc": "When defined, this is the translation key (or literal text) that will be used as the name of the power, instead of the default generated one."
        },
        "id": {
            "name": "ID",
            "type": "text",
            "desc": "Namepsaced ID of the power. Use '/'s to define folders.&#013;If not specified, it will be based on the display name."
        },
        "description": {
            "name": "Description",
            "type": "textarea",
            "desc": "When defined, this is the translation key (or literal text) that will be used as the description of the power, instead of the default generated one."
        },
        "loading_priority": {
            "name": "Load Priority",
            "type": "number",
            "desc": "Powers with higher loading priority override powers registered under the same ID with a lower loading priority.&#013;Use a value greater than 0 if you want to override powers added by the mod itself."
        },
        "hidden": {
            "name": "Hidden",
            "type": "checkbox",
            "desc": "If set to true, this power will not show up in the list of powers an origin has."
        },
        "type": {
            "name": "Type",
            "type": "options",
            "desc": "The most important field. ID of a power type, defining how this power behaves and which other fields are required. Check the wiki for more information.",
            "options": powerTypes
        },
        "type_options": {
            "name": "Type Options",
            "type": "more",
            "desc": "Options specific to the type of power."
        }
    }
};

var subforms = {
    "origin-id": {
        "id": {
            "name": "ID",
            "type": "rtext",
            "desc": "Namespaced ID of the origin for use."
        },
        "condition": {
            "name": "Condition",
            "type": "options",
            "desc": "ID of a player condition that this origin depends on in this layer. Check the wiki for more information.",
            "options": pConditions
        },
        "condition_options": {
            "name": "Condition Options",
            "type": "more",
            "desc": "Options specific to the type of player condition."
        }
    },
    "power-id": {
        "ID": {
            "name": "ID",
            "type": "rtext",
            "desc": "Namespaced ID of the power for use."
        }
    },
    "upgrade": {
        "condition": {
            "name": "Advancement",
            "type": "text",
            "desc": "Advancement condition on which to apply this upgrade."
        },
        "origin": {
            "name": "Origin ID",
            "type": "text",
            "desc": "Origin to upgrade to when the advancement has been met."
        },
        "announcement": {
            "name": "Announcement",
            "type": "textarea",
            "desc": "Message sent to chat when a player acquires this upgrade."
        }
    }
};

// Function to normalize strings
function ns(str) {
    "use strict";
    return str.replace(/\s+/g, '-').replace(/\W+/g, '').toLowerCase();
}

// Function to generate and insert html into the page based on the dictionary
function insertForm(loc, header, form, id) {
    "use strict";
    if (header) {
        loc.append(header);
    }
    for (const [itemID, item] of Object.entries(form)) {
        // Get element id from id and key
        let elemID = id + "-" + itemID;
        // Append Div for item and description
        loc.append(`<div class="iitem" title="${item.desc}">${item.name}:</div>`);
        // Append custom input dependent on the type
        switch (item.type) {
            case "text":
                loc.append(`<input id="${elemID}">`);
                break;
            case "rtext":
                loc.append(`<input id="${elemID}" list="r-${elemID}"></input><datalist id="r-${elemID}"></datalist>`);
                break;
            case "number":
                loc.append(`<input type="number" id="${elemID}">`);
                break;
            case "checkbox":
                loc.append(`<input type="checkbox" id="${elemID}">`);
                break;
            case "file":
                loc.append(`<input type="file" id="${elemID}">`);
                break;
            case "textarea":
                loc.append(`<textarea id="${elemID}"></textarea>`);
                break;
            case "options":
                let items = [];
                items.push(`<select id="${elemID}">`);
                for (const v of item.options) {
                    items.push(`<option value="${v}">${v}</option>`);
                }
                items.push("</select>");
                loc.append(items.join());
                break;
            default:
                // If it's not any of the above options, it has a panel
                loc = loc.append(`<div class="panel" id="${elemID}"></div>`);
                let pnl = loc.find("#"+elemID);
                
                // Load list.html if it is a list
                if (item.type.startsWith("list")) {
                    pnl.append('<div class="zlist"><select size=7></select><div><button>+</button><button>-</button><button>˄</button><button>˅</button></div></div><br>');
                    
                    // Create Item sub-form (with RECURSION!)
                    insertForm(pnl, "", subforms[item.type.substring(5)], elemID);
                }
                // Insert subform if it is a particular dict
                else if (item.type.startsWith("sub")) {
                    insertForm(pnl, "", subforms[item.type.substring(4)], elemID);
                }
                // Super special case, load dictionary editor (for custom stuffs)
                else if (item.type === "dict") {
                    // TODO: dictionary editor
                }
                break;
        }
        loc.append("<br>\n\n");
    }
}

// Things to do when the document is done loading
$(document).ready(function() {
    insertForm($("#div-meta"), "<h2>pack - Unnamed Pack</h2>\n", forms.meta, "ipt-meta");
    insertForm($("#div-layer"), "<h2>layer - origins:origin</h2>\n", forms.layer, "ipt-layer");
    insertForm($("#div-origin"), "<h2>origin - New Origin</h2>\n", forms.origin, "ipt-origin");
    insertForm($("#div-power"), "<h2>power - New Power</h2>\n", forms.power, "ipt-power");
    
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
    
    var contentBox = $("#content-box");
    contentBox.on("change", selectContent);
    contentBox.on("focus", ensureSelect)
    
    // Load data if cookie
    var ocd = Cookies.get("origin-creator-data")
    if (ocd) {
        // Delete the default origin
        $('option[value="layer-origins:origin"]').remove();
        delete data["layer"]["origins:origin"];
        // Load cookie into data
        data = JSON.parse(atob(ocd));
        // Create items in listbox
        for (const [itemid, item] of Object.entries(data["layer"])) {
            $("#layers-group").append(`<option value="layer-${itemid}">${itemid}</option>`);
        }
        for (const [itemid, item] of Object.entries(data["origin"])) {
            $("#origins-group").append(`<option value="origin-${itemid}">${item.name}</option>`);
        }
        for (const [itemid, item] of Object.entries(data["power"])) {
            $("#powers-group").append(`<option value="power-${itemid}">${item.name}</option>`);
        }
        
        //save();
    }
});

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

// Function to split screen into screen and subscreen
function splitScreen(s) {
    var loc = s.search("-");
    if (loc == -1) {
        return [s, ""]
    } else {
        return [s.substring(0, loc), s.substring(loc+1)]
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
    $(".content").attr("hidden", true);
    activeElem.removeAttr('hidden');
    
    // Set header and variables
    active = data[screen];
    if (screen == "help" || screen == "meta") {
        subscreen = null;
    } else {
        active = active[subscreen];
        activeElem.find(">h2").text(screen + " - " + subscreen);
    }
    
    // Load data
    if (active) {
        for (const [itemID, item] of Object.entries(forms[screen])) {
            
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

// Delete item
function deleteItem() {
    "use strict";
    if (screen != "help" && screen != "meta") {
        // Delete from data
        delete data[screen][subscreen];
        // Delete from content box
        $('option[value="' + fullscreen + '"]').remove();
        // Change screen
        changeScreen("help");
        
        save();
    }
}
// Save the webpage all into a cookie
function save() {
    Cookies.set("origin-creator-data", btoa(JSON.stringify(data)));
}
// Reset the entire pack to default
function resetPack() {
    "use strict";
    Cookies.remove("origin-creator-data")
    location.reload();
}
function help() {
    "use strict";
    changeScreen("help");
}

// Generate a unique id of a layer, origin, or power based on the type and n.
function genID(type) {
    var l;
    do {
        l = pid + ":" + type + n;
        n++;
    } while (l in data[type]);
    return l;
}
function newItem(type, content, name) {
    "use strict";
    // Create name
    var i = genID(type);
    content.id = i;
    
    // Create item
    if (name) {
        $("#" + type + "s-group").append(`<option value="${type}-${i}">${name}</option>`);
        content.name = name;
    } else {
        $("#" + type + "s-group").append(`<option value="${type}-${i}">${i}</option>`);
    }
    // Create item data
    data[type][i] = content;
    
    // Select this item in the list
    document.querySelector(`option[value="${type}-${i}"]`).selected = true;
    changeScreen(type + "-" + i);
    
    save();
}
function newLayer() {
    newItem("layer", {"replace": false, "origins": []})
}
function newOrigin() {
    newItem("origin", {"name": "New Origin"})
}
function newPower() {
    newItem("power", {"name": "New Power"})
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
