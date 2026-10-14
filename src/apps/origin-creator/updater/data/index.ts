import actionsJson from "./actions.json";
import conditionsJson from "./conditions.json";
import powersJson from "./powers.json";
import type { FieldDef, ShapeTable } from "../types";

export const actions = actionsJson as unknown as {
    entity_actions: ShapeTable;
    bientity_actions: ShapeTable;
    block_actions: ShapeTable;
    item_actions: ShapeTable;
    meta_actions: ShapeTable;
};

export const conditions = conditionsJson as unknown as {
    entity_conditions: ShapeTable;
    bientity_conditions: ShapeTable;
    block_conditions: ShapeTable;
    biome_conditions: ShapeTable;
    damage_conditions: ShapeTable;
    item_conditions: ShapeTable;
    fluid_conditions: ShapeTable;
    meta_conditions: ShapeTable;
};

export const powers = (powersJson as unknown as { powers: Record<string, FieldDef[]> }).powers as ShapeTable;

export const basePowerFields = (powersJson as unknown as { power: string[] }).power;
