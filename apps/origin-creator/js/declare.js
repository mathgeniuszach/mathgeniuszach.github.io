// Data that pretty much stores everything
var empty_data = {
    "$": 3, // Version number to know how to convert data
    "meta": {
        "name": "My Pack",
        "id": "mypack",
        "pack_format": 6
    },
    "tags/": {
        "blocks/": {},
        "entity_types/": {},
        "fluids/": {},
        "functions/": {},
        "items/": {}
    },
    "functions/": {},
    "predicates/": {},
    "recipes/": {},
    "loot_tables/": {},
    "advancements/": {},
    //"data_scripts/": {}
};
var data = {
    "$": 3, // Version number to know how to convert data
    "meta": {
        "name": "My Pack",
        "id": "mypack",
        "pack_format": 6
    },
    "tags/": {
        "blocks/": {},
        "entity_types/": {},
        "fluids/": {},
        "functions/": {},
        "items/": {}
    },
    "functions/": {},
    "predicates/": {},
    "advancements/": {},
    "recipes/": {},
    "loot_tables/": {},
    //"data_scripts/": {}
};
const types = ["origin_layers", "origins", "powers", "tags", "predicates", "recipes", "loot_tables", "advancements", "__"];
const ttypes = ["meta", "origin_layers", "origins", "powers", "tags", "functions", "predicates", "recipes", "loot_tables", "advancements", "data_scripts"];
const iconed = ["meta", "origin_layers/", "origins/", "powers/", "tags/", "functions/", "predicates/", "recipes/", "loot_tables/", "advancements/", "data_scripts/"];
const non_simple = ["origin_layers/", "origins/", "powers/"];

const urlArgs = new URLSearchParams(location.search);
// Whether or not to remove the Origins part of the creator by default
var simplified = urlArgs.get("type") == "simple";
// Save location
var saveLoc = urlArgs.get("save") || "";
var extDataLoc = decodeURIComponent(urlArgs.get("data") || "");

var content_data = [
    {"text": "meta", "type": "meta"},
    {"text": "tags", "type": "tags", "children": [
        {"text": "blocks"},
        {"text": "entity_types"},
        {"text": "fluids"},
        {"text": "functions"},
        {"text": "items"}
    ]},
    {"text": "functions", "type": "functions"},
    {"text": "predicates", "type": "predicates"},
    {"text": "recipes", "type": "recipes"},
    {"text": "loot_tables", "type": "loot_tables"},
    {"text": "advancements", "type": "advancements"},
    //{"text": "data_scripts", "type": "data_scripts"}
];
var jstree_types = {
    "file": {"icon": "i/file.png", "max_depth": 0},
    "meta": {"icon": "i/file.png", "max_depth": 0},
    "origin_layers": {"icon": "i/layer.png"},
    "origins": {"icon": "i/origin.png"},
    "powers": {"icon": "i/power.png"},
    "tags": {"icon": "i/tag.png"},
    "functions": {"icon": "i/function.png"},
    "predicates": {"icon": "i/predicate.png"},
    "advancements": {"icon": "i/advancement.png"},
    "recipes": {"icon": "i/recipe.png"},
    "loot_tables": {"icon": "i/loot_table.png"},
    "data_scripts": {"icon": "i/data_script.png"}
};
if (!simplified) {
    content_data.push(
        {"text": "origin_layers", "type": "origin_layers", "children": [
            {"text": "origins:origin", "type": "file"}
        ]},
        {"text": "origins", "type": "origins"},
        {"text": "powers", "type": "powers"}
    );
    data["origin_layers/"] = {
        "origins:origin": {
            "replace": false,
            "origins": []
        }
    };
    data["origins/"] = {};
    data["powers/"] = {};
}