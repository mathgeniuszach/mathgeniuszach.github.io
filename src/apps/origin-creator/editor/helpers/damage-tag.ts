import { Helper } from "./types";

// Helper for fields that take a damage TAG, like:
//   "damage_condition": { "type": "origins:in_tag", "tag": "minecraft:is_fire" }
//
// TEMPORARY LIST (see damage-type.ts for how to read it from the schema instead).
const helper: Helper = {
    id: "damage-tag",
    title: "Damage tags",
    match: ({ link }) => link === "damage_type_tag",
    sections: () => [
        {
            label: "Damage tags",
            items: [
                { value: "minecraft:is_fire" },
                { value: "minecraft:bypasses_armor" },
                { value: "minecraft:bypasses_effects" },
            ],
        },
    ],
};

export default helper;
