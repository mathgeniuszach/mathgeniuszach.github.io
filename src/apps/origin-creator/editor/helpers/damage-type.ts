import { Helper } from "./types";

// Helper for fields that take a damage TYPE, like:
//   "damage_condition": { "type": "origins:type", "damage_type": "minecraft:magic" }
//
// TEMPORARY LIST. Later this can be read from the schema instead of being written here, for example:
//   import { locateLink } from "../build";
//   items: (locateLink("damage_type") as any).enum.map(value => ({ value }))
const helper: Helper = {
    id: "damage-type",
    title: "Damage types",
    match: ({ link, key, schema }) => link === "damage_type" || (key === "damage_type" && schema?.type === "string"),
    sections: () => [
        {
            label: "Damage types",
            items: [
                { value: "minecraft:magic" },
                { value: "minecraft:fire" },
                { value: "minecraft:fall" },
            ],
        },
    ],
};

export default helper;
