import { Helper } from "./types";

// Helper for fields that take a damage TAG, like:
//   "damage_condition": { "type": "origins:in_tag", "tag": "minecraft:is_fire" }
//
// TEMPORARY LIST (see damage-type.ts for how to read it from the schema instead).
const helper: Helper = {
    id: "damage-tag",
    title: "Damage tags",
    match: ({ link, key, scope, path }) => link === "damage_type_tag" || (key === "tag" && scope === "damage_cond" && path[path.length - 1] === "string-origins:in_tag"),
    sections: () => [
        {
            label: "Damage tags",
            items: [
                { value: "minecraft:always_hurts_ender_dragons" },
                { value: "minecraft:always_kills_armor_stands" },
                { value: "minecraft:always_most_significant_fall" },
                { value: "minecraft:always_triggers_silverfish" },
                { value: "minecraft:avoids_guardian_thorns" },
                { value: "minecraft:burn_from_stepping" },
                { value: "minecraft:burns_armor_stands" },
                { value: "minecraft:bypasses_armor" },
                { value: "minecraft:bypasses_cooldown" },
                { value: "minecraft:bypasses_effects" },
                { value: "minecraft:bypasses_enchantments" },
                { value: "minecraft:bypasses_invulnerability" },
                { value: "minecraft:bypasses_resistance" },
                { value: "minecraft:bypasses_shield" },
                { value: "minecraft:bypasses_wolf_armor" },
                { value: "minecraft:can_break_armor_stand" },
                { value: "minecraft:damages_helmet" },
                { value: "minecraft:ignites_armor_stands" },
                { value: "minecraft:is_drowning" },
                { value: "minecraft:is_explosion" },
                { value: "minecraft:is_fall" },
                { value: "minecraft:is_fire" },
                { value: "minecraft:is_freezing" },
                { value: "minecraft:is_lightning" },
                { value: "minecraft:is_player_attack" },
                { value: "minecraft:is_projectile" },
                { value: "minecraft:mace_smash" },
                { value: "minecraft:no_anger" },
                { value: "minecraft:no_impact" },
                { value: "minecraft:no_knockback" },
                { value: "minecraft:panic_causes" },
                { value: "minecraft:panic_environmental_causes" },
                { value: "minecraft:sulfur_cube_with_block_immune_to" },
                { value: "minecraft:witch_resistant_to" },
                { value: "minecraft:wither_immune_to" },
            ],
        },
    ],
};

export default helper;
