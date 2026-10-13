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
                { value: "minecraft:arrow" },
                { value: "minecraft:bad_respawn_point" },
                { value: "minecraft:cactus" },
                { value: "minecraft:campfire" },
                { value: "minecraft:cramming" },
                { value: "minecraft:dragon_breath" },
                { value: "minecraft:drown" },
                { value: "minecraft:dry_out" },
                { value: "minecraft:ender_pearl" },
                { value: "minecraft:explosion" },
                { value: "minecraft:fall" },
                { value: "minecraft:falling_anvil" },
                { value: "minecraft:falling_block" },
                { value: "minecraft:falling_stalactite" },
                { value: "minecraft:fireball" },
                { value: "minecraft:fireworks" },
                { value: "minecraft:fly_into_wall" },
                { value: "minecraft:freeze" },
                { value: "minecraft:generic" },
                { value: "minecraft:generic_kill" },
                { value: "minecraft:hot_floor" },
                { value: "minecraft:in_fire" },
                { value: "minecraft:in_wall" },
                { value: "minecraft:indirect_magic" },
                { value: "minecraft:lava" },
                { value: "minecraft:lightning_bolt" },
                { value: "minecraft:mace_smash" },
                { value: "minecraft:magic" },
                { value: "minecraft:mob_attack" },
                { value: "minecraft:mob_attack_no_aggro" },
                { value: "minecraft:mob_projectile" },
                { value: "minecraft:on_fire" },
                { value: "minecraft:out_of_world" },
                { value: "minecraft:outside_border" },
                { value: "minecraft:player_attack" },
                { value: "minecraft:player_explosion" },
                { value: "minecraft:sonic_boom" },
                { value: "minecraft:spit" },
                { value: "minecraft:stalagmite" },
                { value: "minecraft:starve" },
                { value: "minecraft:sting" },
                { value: "minecraft:sweet_berry_bush" },
                { value: "minecraft:thorns" },
                { value: "minecraft:thrown" },
                { value: "minecraft:trident" },
                { value: "minecraft:unattributed_fireball" },
                { value: "minecraft:wind_charge" },
                { value: "minecraft:wither" },
                { value: "minecraft:wither_skull" },
                { value: "apoli:hurt_by_water" },
                { value: "apoli:out_of_water" },
            ],
        },
    ],
};

export default helper;
