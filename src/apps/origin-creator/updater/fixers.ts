import { actions, conditions, powers } from "./data";
import type { Ctx, JsonObject, ShapeTable, Trace, FieldType } from "./types";
import { basename, childTrace, entityGroupToTag, getType, has, isObject, renameKey } from "./util";

export function iterateThroughFields(
    ctx: Ctx,
    trace: Trace,
    type: string,
    data: JsonObject,
    shapeData: ShapeTable,
    metaType?: string,
): void {
    const shape = shapeData[type];
    if (!shape) {
        ctx.log("ERROR", trace, `Field ${type} does not exist or belongs to an addon.`);
        return;
    }
    for (const field of shape) {

        if (!has(data, field.name)) continue;
        const fieldTrace = childTrace(trace, "." + field.name);
        data[field.name] = findAllowedTypes(ctx, fieldTrace, field.type, data[field.name], metaType);
    }
}

function findAllowedTypes(ctx: Ctx, trace: Trace, allowed: FieldType[], fieldData: any, metaType?: string): any {
    for (const typ of allowed) {
        if (typ.is_array) {
            if (!Array.isArray(fieldData)) continue;
            fieldData.forEach((item, i) => {
                selectType(ctx, childTrace(trace, `[${i}]`), typ.type, item, metaType);
            });
        } else {
            selectType(ctx, trace, typ.type, fieldData, metaType);
        }
    }
    return fieldData;
}

function selectType(ctx: Ctx, trace: Trace, type: string, data: any, metaType?: string): void {
    if (!isObject(data)) return;

    switch (type) {
        case "Entity Action Type": return fixEntityAction(ctx, trace, data);
        case "Bi-entity Action Type": return fixBientityAction(ctx, trace, data);
        case "Block Action Type": return fixBlockAction(ctx, trace, data);
        case "Item Action Type": return fixItemAction(ctx, trace, data);
        case "Entity Condition Type": return fixEntityCondition(ctx, trace, data);
        case "Bi-entity Condition Type": return fixBientityCondition(ctx, trace, data);
        case "Block Condition Type": return fixBlockCondition(ctx, trace, data);
        case "Item Condition Type": return fixItemCondition(ctx, trace, data);
        case "Damage Condition Type": return fixDamageCondition(ctx, trace, data);
        case "Biome Condition Type": return fixBiomeCondition(ctx, trace, data);
        case "Fluid Condition Type": return fixFluidCondition(ctx, trace, data);
        case "Attribute Modifier": return fixAttributeModifier(ctx, trace, data);
        case "Attributed Attribute Modifier": return fixAttributedAttributeModifier(ctx, trace, data);
        case "Status Effect Instance": return fixStatusEffectInstance(ctx, trace, data);
        case "Food Component": return fixFoodComponent(ctx, trace, data);
        case "Crafting Recipe": return fixCraftingRecipe(ctx, trace, data);
        case "Particle Effect": return fixParticleEffect(ctx, trace, data);

        case "Action Type":
            if (metaType) selectType(ctx, trace, `${metaType} Action Type`, data);
            return;
        case "Condition Type":
            if (metaType) selectType(ctx, trace, `${metaType} Condition Type`, data);
            return;

        case "Object": {

            if (!metaType) return;

            if (has(data, "element")) {
                selectType(ctx, childTrace(trace, ".element"), `${metaType} Action Type`, data.element);
            }

            if (has(data, "condition")) {
                selectType(ctx, childTrace(trace, ".condition"), `${metaType} Action Type`, data.condition);
            }
            if (has(data, "action")) {
                selectType(ctx, childTrace(trace, ".action"), `${metaType} Action Type`, data.action);
            }
            return;
        }
    }
}

function fixDamage(ctx: Ctx, trace: Trace, data: JsonObject): void {
    if (!has(data, "damage_type")) {
        if (has(data, "source")) {

            ctx.log("WARNING", trace, "Fixing damage types is unimplemented.");
        } else {
            ctx.log("ERROR", trace, "Couldn't find damage source");
        }
    }
}

function fixMetaAction(ctx: Ctx, trace: Trace, type: string, data: JsonObject): void {
    if (type === "origins:chance") {
        if (has(data, "action")) {
            renameKey(data, "action", "success_action");
            ctx.log("INFO", trace, "Renamed action to success_action");
        }
    }
}

function fixAction(
    ctx: Ctx,
    trace: Trace,
    data: JsonObject,
    table: ShapeTable,
    kind: "Entity" | "Bi-entity" | "Block" | "Item",
    after?: (type: string) => void,
): void {
    const type = getType(data);
    if (type === null) {
        ctx.log("ERROR", trace, "Action has no type field.");
        return;
    }
    if (type in actions.meta_actions) {
        fixMetaAction(ctx, trace, type, data);

        iterateThroughFields(ctx, trace, type, data, actions.meta_actions, kind);
    } else if (type in table) {
        iterateThroughFields(ctx, trace, type, data, table);
        after?.(type);
    }

}

export function fixEntityAction(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixAction(ctx, trace, data, actions.entity_actions, "Entity", (type) => {
        if (type === "origins:action_on_set") {
            data.type = "origins:action_on_entity_set";
            ctx.log("INFO", trace, "Renamed action_on_set to action_on_entity_set");
        }

        if (type === "origins:spawn_effect_cloud") {
            if (has(data, "effect")) {
                const effect = data.effect;
                delete data.effect;
                data.effect_component = { custom_effects: [effect] };
            } else if (has(data, "effects")) {
                const effects = data.effects;
                delete data.effects;
                data.effect_component = { custom_effects: effects };
            }
            ctx.log("INFO", trace, "Updated action spawn effect cloud to use components");
        }
        if (type === "origins:damage") fixDamage(ctx, trace, data);
        if (type === "origins:feed") renameKey(data, "food", "nutrition");
    });
}

export function fixBientityAction(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixAction(ctx, trace, data, actions.bientity_actions, "Bi-entity", (type) => {
        if (type === "origins:add_to_set") {
            data.type = "origins:add_to_entity_set";
            ctx.log("INFO", trace, "Renamed add_to_set to add_to_entity_set");
        }
        if (type === "origins:remove_from_set") {
            data.type = "origins:remove_from_entity_set";
            ctx.log("INFO", trace, "Renamed remove_from_set to remove_from_entity_set");
        }
        if (type === "origins:damage") fixDamage(ctx, trace, data);
    });
}

export function fixBlockAction(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixAction(ctx, trace, data, actions.block_actions, "Block");
}

export function fixItemAction(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixAction(ctx, trace, data, actions.item_actions, "Item", (type) => {
        if (type === "origins:merge_nbt") {
            data.type = "origins:merge_custom_data";
            ctx.log("INFO", trace, "Renamed item action type merge_nbt to merge_custom_data");
        }
    });
}

function fixMetaCondition(_ctx: Ctx, _trace: Trace, _type: string, _data: JsonObject): void {

}

function fixCondition(
    ctx: Ctx,
    trace: Trace,
    data: JsonObject,
    table: ShapeTable,
    kind: "Entity" | "Bi-entity" | "Block" | "Item" | "Damage" | "Biome" | "Fluid",
    after?: (type: string) => void,
): void {
    const type = getType(data);
    if (type === null) {
        ctx.log("ERROR", trace, "Condition has no type field.");
        return;
    }
    if (type in conditions.meta_conditions) {
        fixMetaCondition(ctx, trace, type, data);
        iterateThroughFields(ctx, trace, type, data, conditions.meta_conditions, kind);
    } else if (type in table) {
        iterateThroughFields(ctx, trace, type, data, table);
        after?.(type);
    }
}

export function fixEntityCondition(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixCondition(ctx, trace, data, conditions.entity_conditions, "Entity", (type) => {
        if (type === "origins:entity_group") {
            ctx.log("INFO", trace, "Changing entity_group condition for an in_tag condition.");
            data.type = "origins:in_tag";
            const tag = entityGroupToTag(data.group);
            if (tag !== null) data.group = tag;
            else ctx.log("ERROR", trace, "Entity Group not found, was unable to find correct tag.");
            renameKey(data, "group", "tag");
        }
        if (type === "origins:set_size") {
            data.type = "origins:entity_set_size";
            ctx.log("INFO", trace, "Renamed set_size to entity_set_size");
        }
    });
}

export function fixBientityCondition(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixCondition(ctx, trace, data, conditions.bientity_conditions, "Bi-entity", (type) => {
        if (type === "origins:in_set") {
            data.type = "origins:in_entity_set";
            ctx.log("INFO", trace, "Renamed in_set to in_entity_set");
        }
    });
}

export function fixBlockCondition(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixCondition(ctx, trace, data, conditions.block_conditions, "Block", (type) => {
        if (type === "origins:replacable") {
            data.type = "origins:replaceable";
            ctx.log("INFO", trace, "Renamed replacable block condition to replaceable (typo)");
        }
        if (type === "origins:material") {
            ctx.log(
                "ERROR",
                trace,
                "Material condition fix not implemented, see https://origins.readthedocs.io/en/latest/types/data_types/material/ for how to fix it",
            );
        }
    });
}

export function fixItemCondition(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixCondition(ctx, trace, data, conditions.item_conditions, "Item", (type) => {
        switch (type) {
            case "origins:harvest_level":

                ctx.log("WARNING", trace, "Harvest levels don't exsist anymore.");
                ctx.log("ERROR", trace, "Fixing harvest level condition is unimplemented.");
                break;
            case "origins:nbt":
                data.type = "origins:custom_data";
                ctx.log("INFO", trace, "Renamed nbt item condition to custom_data");
                ctx.log("ERROR", trace, "Fixing nbt/custom_data condition is unimplemented.");

                break;
            case "origins:meat":
                data.type = "origins:ingredient";
                data.ingredient = { tag: "minecraft:wolf_food" };
                ctx.log("INFO", trace, "Updated meat item condition to use the minecraft:wolf_food tag instead");
                break;
        }
        if (type === "origins:is_damageable") {
            data.type = "origins:damageable";
            ctx.log("INFO", trace, "Renamed is_damageable to damageable");
        }
        if (type === "origins:is_equippable") {
            data.type = "origins:equippable";
            ctx.log("INFO", trace, "Renamed is_equippable to equippable");
        }
        if (type === "origins:fireproof") {
            data.type = "origins:fire_resistant";
            ctx.log("INFO", trace, "Renamed fireproof to fire_resistant");
        }
    });
}

export function fixDamageCondition(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixCondition(ctx, trace, data, conditions.damage_conditions, "Damage");
}

export function fixFluidCondition(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixCondition(ctx, trace, data, conditions.fluid_conditions, "Fluid");
}

const BIOME_CATEGORY_TAGS: Record<string, [string, boolean]> = {
    beach: ["minecraft:is_beach", false],
    desert: ["c:desert", true],
    extreme_hills: ["minecraft:is_hill", false],
    forest: ["minecraft:is_forest", false],
    icy: ["c:is_icy", true],
    jungle: ["minecraft:is_jungle", false],
    mesa: ["minecraft:is_badlands", false],
    mountain: ["minecraft:is_mountain", false],
    mushroom: ["c:is_mushroom", true],
    nether: ["minecraft:is_nether", false],
    none: ["c:is_void", true],
    ocean: ["minecraft:is_ocean", false],
    plains: ["c:is_plains", true],
    river: ["minecraft:is_river", false],
    savanna: ["minecraft:is_savanna", false],
    swamp: ["c:is_swamp", true],
    taiga: ["minecraft:is_taiga", false],
    the_end: ["minecraft:is_end", false],
    underground: ["c:is_underground", true],
};

export function fixBiomeCondition(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixCondition(ctx, trace, data, conditions.biome_conditions, "Biome", (type) => {
        if (type !== "origins:category") return;
        const category = data.category;
        const entry = typeof category === "string" && has(BIOME_CATEGORY_TAGS, category) ? BIOME_CATEGORY_TAGS[category] : null;
        if (!entry) return;
        const [tag, fabricOnly] = entry;
        delete data.category;
        data.tag = tag;
        data.type = "origins:in_tag";
        ctx.log("INFO", trace, `Updated biome category ${category} to ${tag} tag`);
        if (fabricOnly) ctx.log("WARNING", trace, "This tag will only work on fabric");
    });
}

function fixAttribute(ctx: Ctx, trace: Trace, data: JsonObject): void {
    if (typeof data.attribute !== "string") return;
    if (data.attribute.includes("reach-entity-attributes:attack_range")) {
        data.attribute = data.attribute.replace("reach-entity-attributes:attack_range", "minecraft:player.entity_interaction_range");
        ctx.log("INFO", trace, "Updated attack range attribute to work without the mod Reach Entity Attributes");
    }
    if (data.attribute.includes("reach-entity-attributes:reach")) {
        data.attribute = data.attribute.replace("reach-entity-attributes:reach", "minecraft:player.block_interaction_range");
        ctx.log("INFO", trace, "Updated reach attribute to work without the mod Reach Entity Attributes");
    }
}

const OPERATION_RENAMES = {
    attributed: { addition: "add_value", multiply_base: "add_multiplied_base", multiply_total: "add_multiplied_total" },
    plain: { addition: "add_base_early", multiply_base: "multiply_base_additive", multiply_total: "multiply_total_multiplicative" },
} as const;

function fixOperation(ctx: Ctx, trace: Trace, data: JsonObject, kind: "attributed" | "plain"): void {
    const op = data.operation;
    if (typeof op !== "string") return;
    const renames = OPERATION_RENAMES[kind] as Record<string, string>;
    if (has(renames, op)) {
        data.operation = renames[op];
        ctx.log("INFO", trace, `Renamed operation ${op} to ${renames[op]}`);
    }
}

function fixValue(ctx: Ctx, trace: Trace, data: JsonObject): void {
    if (has(data, "value")) {
        renameKey(data, "value", "amount");
        ctx.log("INFO", trace, "Renamed value to amount");
    }
}

export function fixAttributeModifier(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixOperation(ctx, trace, data, "plain");
    fixValue(ctx, trace, data);
}

export function fixAttributedAttributeModifier(ctx: Ctx, trace: Trace, data: JsonObject): void {
    fixAttribute(ctx, trace, data);
    if (!has(data, "id")) {

        const id = `${trace.namespace}:${basename(trace.file ?? "").replace(/\.json$/, "")}`;
        data.id = id;
        ctx.log("INFO", trace, `Added id ${id} to attributed attribute modifier`);
    }
    fixOperation(ctx, trace, data, "attributed");
    fixValue(ctx, trace, data);
}

export function fixStatusEffectInstance(ctx: Ctx, trace: Trace, data: JsonObject): void {
    if (has(data, "effect")) {
        renameKey(data, "effect", "id");
        ctx.log("INFO", trace, "Renamed effect to id");
    }
    if (has(data, "is_ambient")) {
        renameKey(data, "is_ambient", "ambient");
        ctx.log("INFO", trace, "Renamed is_ambient to ambient");
    }
}

export function fixFoodComponent(_ctx: Ctx, _trace: Trace, data: JsonObject): void {

    if (has(data, "hunger")) renameKey(data, "hunger", "saturation");
    if (has(data, "always_edible")) renameKey(data, "always_edible", "can_always_eat");
    if (has(data, "snack") && data.snack) {
        delete data.snack;
        data.eat_seconds = 0.8;
    }
}

export function fixCraftingRecipe(ctx: Ctx, trace: Trace, _data: JsonObject): void {
    ctx.log("ERROR", trace, "Fixing crafting recipes is unimplemented.");
}

const BLOCK_PARTICLES = new Set(["block", "minecraft:block", "block_marker", "minecraft:block_marker", "falling_dust", "minecraft:falling_dust"]);
const num = "\\d(?:\\.\\d+)?";

export function fixParticleEffect(ctx: Ctx, trace: Trace, data: JsonObject): void {
    if (!has(data, "params")) return;
    const oldParams = data.params;
    if (typeof oldParams !== "string") return;
    const ptype: unknown = data.type;
    if (typeof ptype !== "string") {
        ctx.log("ERROR", trace, "Particle effect has no type, unable to update params.");
        return;
    }

    let newParams: any;
    const fail = () => {
        ctx.log("ERROR", trace, `Unable to parse params "${oldParams}" for "${ptype}" particle, left unchanged.`);
        return oldParams;
    };

    if (BLOCK_PARTICLES.has(ptype)) {
        const blockstate = /^(?<block>[a-z0-9/:._-]+)(?:\[(?<props>[a-z0-9/._-]+=[a-z0-9/._-]+(?:,\s+[a-z0-9/._-]+=[a-z0-9/._-]+)*)\])?$/;
        const match = blockstate.exec(oldParams);
        if (!match?.groups) {
            newParams = fail();
        } else {
            newParams = { block_state: { Name: match.groups.block } };
            if (match.groups.props) {

                const properties: Record<string, string | number | boolean> = {};
                for (const m of match.groups.props.matchAll(/(?<property>[a-z0-9/._-]+)=(?<value>[a-z0-9/._-]+)/g)) {
                    let value: string | number | boolean = m.groups!.value;
                    if (value === "true") value = true;
                    else if (value === "false") value = false;
                    else if (/^\d+$/.test(value)) value = Number(value);
                    properties[m.groups!.property] = value;
                }
                newParams.Properties = properties;
            }
        }
    } else if (ptype === "dragon_breath" || ptype === "minecraft:dragon_breath") {
        newParams = { power: parseFloat(oldParams) };
    } else if (ptype === "dust" || ptype === "minecraft:dust") {
        const m = new RegExp(`^(?<red>${num}) (?<green>${num}) (?<blue>${num}) (?<scale>${num})`).exec(oldParams);
        newParams = m?.groups
            ? { color: [+m.groups.red, +m.groups.green, +m.groups.blue], scale: +m.groups.scale }
            : fail();
    } else if (ptype === "dust_color_transition" || ptype === "minecraft:dust_color_transition") {
        const m = new RegExp(
            `^(?<fr>${num}) (?<fg>${num}) (?<fb>${num}) (?<scale>${num}) (?<tr>${num}) (?<tg>${num}) (?<tb>${num})`,
        ).exec(oldParams);
        newParams = m?.groups
            ? {
                  from_color: [+m.groups.fr, +m.groups.fg, +m.groups.fb],
                  to_color: [+m.groups.tr, +m.groups.tg, +m.groups.tb],
                  scale: +m.groups.scale,
              }
            : fail();
    } else if (ptype === "item" || ptype === "minecraft:item") {
        newParams = { item: { id: oldParams } };
    } else if (ptype === "sculk_charge" || ptype === "minecraft:sculk_charge") {
        newParams = { roll: parseFloat(oldParams) };
    } else if (ptype === "shriek" || ptype === "minecraft:shriek") {
        newParams = { delay: parseFloat(oldParams) };
    } else if (ptype === "vibration" || ptype === "minecraft:vibration") {
        const m = /^(?<x>\d+(?:\.\d+)?) (?<y>\d+(?:\.\d+)?) (?<z>\d+(?:\.\d+)?) (?<delay>\d+(?:\.\d+)?)/.exec(oldParams);
        newParams = m?.groups
            ? {
                  destination: { type: "block", pos: [+m.groups.x, +m.groups.y, +m.groups.z] },
                  arrival_in_ticks: +m.groups.delay,
              }
            : fail();
    } else {
        newParams = oldParams;
    }

    data.params = newParams;
    ctx.log("INFO", trace, `Updated params for "${ptype}" particle.`);
}

export function fixPower(ctx: Ctx, trace: Trace, data: JsonObject): void {
    ctx.log("INFO", trace, "Fixing power");
    const type = getType(data);
    if (type === null) {
        ctx.log("ERROR", trace, "Power has no type field.");
        return;
    }

    if (isObject(data.condition)) {
        fixEntityCondition(ctx, childTrace(trace, ".condition"), data.condition);
    }

    if (type === "origins:overlay" && has(data, "texture")) {

        ctx.log("ERROR", trace, "Overlay texture change not implemented (if even necessary)");
    }

    iterateThroughFields(ctx, trace, type, data, powers);

    if (type === "origins:entity_group") {
        data.type = "origins:modify_type_tag";
        const tag = entityGroupToTag(data.group);
        if (tag !== null) data.group = tag;
        else ctx.log("ERROR", trace, "Entity Group not found, was unable to find correct tag.");
        renameKey(data, "group", "tag");
    }
}
