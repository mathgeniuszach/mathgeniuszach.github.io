var forms = {
    "meta": {
        "Icon": ["file", "Icon to use in for your pack. It will appear in the mod or datapack."],
        "Name": ["text", "The display name of your pack. It will be used in the mod title or datapack name."],
        "Mod ID": ["text", "If your work is being exported to a mod, you can use this to specify a mod id. If not specified, it will be based on the display name."],
        "Authors": ["text", "Comma-separated list of authors. Authors will be trimmed of spaces from the ends."],
        "Version": ["text", "Version number of your pack."],
        "Description": ["textarea", "Description of your pack for use in a mod."]
    },
    "layer": {
        "ID": ["text", "ID of the layer. Use '/'s to define folders."],
        "Replace": ["checkbox", "Whether or not to replace an already existing layer in another pack."],
        "Origins": ["list-origins", "Origins to include in this layer."]
    },
    "origin": {
        "Name": ["text", "When defined, this is the translation key (or literal text) that will be used as the name of the origin, instead of the default generated one."],
        "ID": ["text", "ID of the origin. Use '/'s to define folders.&#013;If not specified, it will be based on the display name."],
        "Description": ["textarea", "When defined, this is the translation key (or literal text) that will be used as the description of the origin, instead of the default generated one."],
        "Icon Item": ["text", "The item ID of the item to use as the icon for this origin in the origin screen."],
        "Impact": ["number", "The impact value of the origin, where 0 = none, 1 = low, 2 = medium, 3 = high."],
        "Order": ["number", "In the origin screen, origins are sorted first by impact, and second by this order value, where lower values come first."],
        "Powers": ["list-powers", "IDs of powers which this origin should have."],
        "Load Priority": ["number", "Origins with higher loading priority override origins registered under the same ID with a lower loading priority.&#013;Use a value greater than 0 if you want to override origins added by the mod itself."],
        "Unchoosable": ["checkbox", "If this is set to true, the origin will not be shown in the origin selection screen and cannot be chosen."],
        "Upgrades": ["list-upgrades", "Defines origins this origin will change into when an advancement is reached by the player."]
    },
    "power": {
        "Name": ["text", "When defined, this is the translation key (or literal text) that will be used as the name of the power, instead of the default generated one."],
        "ID": ["text", "ID of the power. Use '/'s to define folders.&#013;If not specified, it will be based on the display name."],
        "Description": ["textarea", "When defined, this is the translation key (or literal text) that will be used as the description of the power, instead of the default generated one."],
        "Load Priority": ["number", "Powers with higher loading priority override powers registered under the same ID with a lower loading priority.&#013;Use a value greater than 0 if you want to override powers added by the mod itself."],
        "Hidden": ["checkbox", "If set to true, this power will not show up in the list of powers an origin has."],
        "Type": ["options", "The most important field. ID of a power type, defining how this power behaves and which other fields are required. Check the wiki for more information.", [
            "custom",
            "simple",
            "toggle",
            "attribute",
            "conditioned_attribute",
            "burn",
            "cooldown",
            "effect_immunity",
            "elytra_flight",
            "entity_group",
            "exhaust",
            "fire_projectile",
            "inventory",
            "invisibility",
            "invulnerability",
            "launch",
            "model_color",
            "modify_break_speed",
            "modify_damage_dealt",
            "modify_damage_taken",
            "modify_exhaustion",
            "modify_harvest",
            "modify_jump",
            "modify_swim_speed",
            "modify_lava_speed",
            "modify_player_spawn",
            "night_vision",
            "particle",
            "phasing",
            "prevent_item_use",
            "prevent_sleep",
            "restrict_armor",
            "conditioned_restrict_armor",
            "stacking_status_effect",
            "toggle_night_vision",
            "damage_over_time",
            "swimming",
            "fire_immunity",
            "lava_vision",
            "active_self",
            "action_over_time",
            "self_action_when_hit",
            "attacker_action_when_hit",
            "self_action_on_hit",
            "target_action_on_hit",
            "starting_equipment",
            "action_on_callback",
            "walk_on_fluid",
            "shader",
            "shaking",
            "resource",
            "modify_food",
            "modify_xp_gain"
        ]],
        "Type Options": ["panel", "Options specific to the type of power."]
    },
    
    "": {
        
    }
}

// Function to normalize strings
function ns(str) {
    return str.replace(/\s+/g, '-').toLowerCase();
}

// Function to generate and insert html into the page based on the dictionary
function insertForm(loc, header, form, id) {
    loc.html(header);
    for (const [key, value] of Object.entries(form)) {
        // Append 
        loc.append(`<div class="iitem" title="${value[1]}">${key}:&nbsp;</div>`);
        switch (value[0]) {
            case "text":
                loc.append(`<input id="${id}-${ns(key)}">`);
                break;
            case "number":
                loc.append(`<input type="number" id="${id}-${ns(key)}">`);
                break;
            case "checkbox":
                loc.append(`<input type="checkbox" id="${id}-${ns(key)}">`);
                break;
            case "file":
                loc.append(`<input type="file" id="${id}-${ns(key)}">`);
                break;
            case "textarea":
                loc.append(`<textarea id="${id}-${ns(key)}"></textarea>`);
                break;
            case "options":
                items = []
                items.push(`<select id="${id}-${ns(key)}">`);
                for (const v of value[2]) {
                    items.push(`<option value="${ns(v)}">${v}</option>`);
                }
                items.push("</select>")
                loc.append(items.join())
                break;
        }
        loc.append("<br>\n\n")
    }
}

$(document).ready(function() {
    insertForm($("#div-meta"), "<h2>Pack - Unnamed Pack</h2>\n", forms.meta, "ipt-meta");
    insertForm($("#div-layer"), "<h2>Layer - New Layer</h2>\n", forms.layer, "ipt-layer");
    insertForm($("#div-origin"), "<h2>Origin - New Origin</h2>\n", forms.origin, "ipt-origin");
    insertForm($("#div-power"), "<h2>Power - New Power</h2>\n", forms.power, "ipt-power");
});