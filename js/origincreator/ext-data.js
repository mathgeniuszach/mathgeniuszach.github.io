var entity_tags_data = {
    
};

var damage_predicate = {
    "bypasses_armor": {
        "name": "Bypassed Armor",
        "type": "checkbox",
        "desc": "Checks if the damage bypassed the armor of the player (suffocation damage predominantly)."
    },
    "bypasses_invulnerability": {
        "name": "Bypassed Armor",
        "type": "checkbox",
        "desc": "Checks if the damage bypassed the invulnerability status of the player (void or /kill damage)."
    },
    "bypasses_magic": {
        "name": "Bypassed Magic",
        "type": "checkbox",
        "desc": "Checks if the damage was caused by starvation."
    },
    "is_explosion": {
        "name": "Is Explosion",
        "type": "checkbox",
        "desc": "Checks if the damage originated from an explosion."
    },
    "is_fire": {
        "name": "Is Fire",
        "type": "checkbox",
        "desc": "Checks if the damage originated from fire."
    },
    "is_magic": {
        "name": "Is Magic",
        "type": "checkbox",
        "desc": "Checks if the damage originated from fire."
    },
    "is_projectile": {
        "name": "Is Projectile",
        "type": "checkbox",
        "desc": "Checks if the damage originated from a projectile."
    },
    "is_lightning": {
        "name": "Is Lightning",
        "type": "checkbox",
        "desc": "Checks if the damage originated from lightning."
    },
    "direct_entity": {
        "name": "Direct Entity",
        "type": "sub",
        "desc": "The entity that was the direct cause of the damage.",
        "data": entity_tags_data
    },
    "source_entity": {
        "name": "Source Entity",
        "type": "sub",
        "desc": "Checks the entity that was the source of the damage (for example: The skeleton that shot the arrow).",
        "data": entity_tags_data
    }
};

var predicate_data = {};
predicate_data.condition = {
    "name": "Type",
    "type": "options",
    "desc": "The condition's ID, which defines what other fields the predicate has.",
    "more": "__type_options"
};
predicate_data.__type_options = {
    "type": "more",
    "parent": "condition",
    "data": {
        "minecraft:alternative": {
            "terms": {
                "name": "Predicates",
                "type": "list",
                "desc": "A list of conditions to join using 'or'",
                "data": predicate_data
            }
        },
        "minecraft:block_state_property": {
            "block": {
                "name": "Block ID",
                "type": "ns",
                "desc": "A block ID. The test fails if the block doesn't match."
            },
            "properties": {
                "name": "Properties",
                "type": "info",
                "desc": "A map of block property names to values. All values are strings. The test fails if the block doesn't match.",
                "info": "Too complex. Use the 'Toggle Raw' editor to edit this part."
            }
        },
        "minecraft:damage_source_properties": {
            "predicate": damage_predicate
        },
        "minecraft:entity_properties": {
            "entity": {
                "name": "Entity",
                "type": "ns",
                "desc": "Specifies the entity to check for the condition. Set to this to use the entity that died or the player that gained the advancement, opened the container or broke the block, killer for the killer, or killer_player for a killer that is a player."
            },
            "predicate": {
                "name": "Entity Data",
                "type": "sub",
                "desc": "Predicate applied to entity, uses same structure as advancements.",
                "data": entity_tags_data
            }
        },
        "minecraft:entity_scores": {
            "entity": {
                "name": "Entity",
                "type": "ns",
                "desc": "Specifies the entity to check for the condition. Set to this to use the entity that died or the player that gained the advancement, opened the container or broke the block, killer for the killer, or killer_player for a killer that is a player."
            },
            "scores": {
                "name": "Scores",
                "type": "info",
                "desc": "Scores to check. All specified scores must pass for the condition to pass.",
                "info": "Too complex. Use the 'Toggle Raw' editor to edit this part."
            }
        }
    }
}

var extforms = {
    "predicates": predicate_data,
    "advancements": {},
    "recipes": {},
    "loot_tables": {}
}