var condition_data = {};
var condition = {
    "name": "Condition",
    "type": "sub",
    "desc": "A entity condition that this thing depends on in order to work. Check the wiki for more information.",
    "data": condition_data,
    "hidden": true,
    "link": "https://github.com/apace100/origins-fabric/wiki/Entity-Condition"
};

var block_condition_data = {};
var block_condition = {
    "name": "Block Condition",
    "type": "sub",
    "desc": "A block condition that this thing depends on in order to work. Check the wiki for more information.",
    "data": block_condition_data,
    "hidden": true,
    "link": "https://github.com/apace100/origins-fabric/wiki/Block-Condition"
};

var item_condition_data = {};
var item_condition = {
    "name": "Item Condition",
    "type": "sub",
    "desc": "An item condition that this thing depends on in order to work. Check the wiki for more information.",
    "data": item_condition_data,
    "hidden": true,
    "link": "https://github.com/apace100/origins-fabric/wiki/Item-Condition"
};

var damage_condition_data = {};
var damage_condition = {
    "name": "Damage Condition",
    "type": "sub",
    "desc": "A damage condition that this thing depends on in order to work. Check the wiki for more information.",
    "data": damage_condition_data,
    "hidden": true,
    "link": "https://github.com/apace100/origins-fabric/wiki/Damage-Condition"
};

var fluid_condition_data = {};
var fluid_condition = {
    "name": "Fluid Condition",
    "type": "sub",
    "desc": "A fluid condition that this thing depends on in order to work. Check the wiki for more information.",
    "data": fluid_condition_data,
    "hidden": true,
    "link": "https://github.com/apace100/origins-fabric/wiki/Fluid-Condition"
};

var biome_condition_data = {};
var biome_condition = {
    "name": "Biome Condition",
    "type": "sub",
    "desc": "A biome condition that this thing depends on in order to work. Check the wiki for more information.",
    "data": biome_condition_data,
    "hidden": true,
    "link": "https://github.com/apace100/origins-fabric/wiki/Biome-Condition"
};

condition_data.type = {
    "name": "Type",
    "type": "options",
    "desc": "The most important field in the condition. Specifies an ID of a condition to check for.",
    "more": "__type_options",
    "link": "https://github.com/apace100/origins-fabric/wiki/List-of-entity-conditions"
};
condition_data.inverted = {
    "name": "Inverted",
    "type": "checkbox",
    "desc": "If set to true, Origins will instead check that this condition is NOT fulfilled.",
    "default": false
};
condition_data.__type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "origins:constant": {
            "value": {
                "name": "Value",
                "type": "checkbox",
                "default": false
            }
        },
        "origins:and": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "All of these need to evaluate to true in order for the whole condition to be true.",
                "data": condition_data
            }
        },
        "origins:or": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "At least one of these need to evaluate to true in order for the whole condition to be true.",
                "data": condition_data
            }
        },
        "origins:block_collision": {
            "offset_x": {
                "name": "Offset X",
                "type": "double",
                "desc": "By how much of the bounding box size should the box be offset in the X direction (e.g.: 0 = no offset, 1 = offset of exact width, 2 = offset of twice the width of the bounding box)",
                "default": 0.0
            },
            "offset_y": {
                "name": "Offset Y",
                "type": "double",
                "desc": "By how much of the bounding box size should the box be offset in the Y direction (e.g.: 0 = no offset, 1 = offset of exact width, 2 = offset of twice the width of the bounding box)",
                "default": 0.0
            },
            "offset_z": {
                "name": "Offset Z",
                "type": "double",
                "desc": "By how much of the bounding box size should the box be offset in the Z direction (e.g.: 0 = no offset, 1 = offset of exact width, 2 = offset of twice the width of the bounding box)",
                "default": 0.0
            }
        },
        "origins:brightness": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": 'How to compare the brightness against the specified value.',
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Brightness",
                "type": "double",
                "desc": "Which value to compare the brightness against.",
                "default": 0.0
            }
        },
        "origins:daytime": {},
        "origins:fall_flying": {},
        "origins:exposed_to_sun": {},
        "origins:exposed_to_sky": {},
        "origins:in_rain": {},
        "origins:invisible": {},
        "origins:on_fire": {},
        "origins:sneaking": {},
        "origins:sprinting": {},
        "origins:power_active": {
            "power": {
                "name": "Power",
                "type": "ns",
                "desc": "ID of the power which will be checked for being active."
            }
        },
        "origins:status_effect": {
            "effect": {
                "name": "Effect",
                "type": "ns",
                "desc": "ID of the status effect the entity should have."
            },
            "min_amplifier": {
                "name": "Min Amplifier",
                "type": "int",
                "desc": "The minimum amplifier the status effect should have in order to pass the check."
            },
            "max_amplifier": {
                "name": "Max Amplifier",
                "type": "int",
                "desc": "The maximum amplifier the status effect should have in order to pass the check."
            },
            "min_duration": {
                "name": "Min Duration",
                "type": "int",
                "desc": "The minimum duration in ticks the status effect should have in order to pass the check."
            },
            "max_duration": {
                "name": "Max Duration",
                "type": "int",
                "desc": "The maximum duration in ticks the status effect should have in order to pass the check."
            }
        },
        "origins:submerged_in": {
            "fluid": {
                "name": "Fluid",
                "type": "ns",
                "desc": "ID of the fluid tag that should be checked. Most important examples: minecraft:water and minecraft:lava."
            }
        },
        "origins:fluid_height": {
            "fluid": {
                "name": "Fluid",
                "type": "ns",
                "desc": "ID of the fluid tag that should be checked. Most important examples: minecraft:water and minecraft:lava."
            },
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": 'How the fluid height should be compared to the specified value.',
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Fluid Height",
                "type": "double",
                "desc": "Which value the fluid height should be compared to.",
                "default": 0.0
            }
        },
        "origins:origin": {
            "origin": {
                "name": "Origin",
                "type": "ns",
                "desc": "ID of the origin the player needs to have to pass the check."
            },
            "layer": {
                "name": "Layer",
                "type": "ns",
                "desc": "If set, will check only the layer with the provided ID for the origin. This is optional."
            }
        },
        "origins:power": {
            "power": {
                "name": "Power",
                "type": "ns",
                "desc": "ID of the power the player needs to have to pass the check."
            }
        },
        "origins:using_effective_tool": {},
        "origins:food_level": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": 'How to compare the food level against the specified value.',
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Fool Level",
                "type": "int",
                "desc": "Which value to compare the food level against.",
                "default": 0
            }
        },
        "origins:saturation_level": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": 'How to compare the saturation level against the specified value.',
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Saturation Level",
                "type": "double",
                "desc": "Which value to compare the saturation level against.",
                "default": 0.0
            }
        },
        "origins:on_block": {
            "block_condition": block_condition
        },
        "origins:equipped_item": {
            "equipment_slot": {
                "name": "Equipment Slot",
                "type": "options",
                "desc": "Which equipped item to check.",
                "options": ["mainhand", "offhand", "head", "chest", "legs", "feet"]
            },
            "item_condition": item_condition
        },
        "origins:attribute": {
            "attribute": {
                "name": "Attribute",
                "type": "ns",
                "desc": "ID of the attribute of which the value should be checked. Click to see a list of attributes available in vanilla.",
                "link": "https://minecraft.gamepedia.com/Attribute#Attributes"
            },
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How to compare the attribute's value to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Value",
                "type": "double",
                "desc": "Which value to compare the attribute's value to.",
                "default": 0.0
            }
        },
        "origins:swimming": {},
        "origins:resource": {
            "resource": {
                "name": "Resource",
                "type": "ns",
                "desc": "ID of the power type that defines the resource. Must be a Resource (Power Type) which exists on the player. Click to learn about the resource power type.",
                "link": "https://github.com/apace100/origins-fabric/wiki/Resource-%28Power-Type%29"
            },
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How the resource should be compared to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Value",
                "type": "double",
                "desc": "Which value to compare to.",
                "default": 0.0
            }
        },
        "origins:air": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How the breath (in ticks) should be compared to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Air",
                "type": "int",
                "desc": "Which value to compare to.",
                "default": 0
            }
        },
        "origins:in_block": {
            "block_condition": block_condition
        },
        "origins:block_in_radius": {
            "block_condition": block_condition,
            "radius": {
                "name": "Radius",
                "type": "int",
                "desc": "The radius to check blocks in.",
                "default": 5
            },
            "shape": {
                "name": "Shape",
                "type": "options",
                "desc": "Whether to check in a cube- or a star-shaped form.",
                "options": ["cube", "star"]
            },
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How the number of blocks in the radius which fulfill block_condition should be compared to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Block Count",
                "type": "int",
                "desc": "The value to compare the number to.",
                "default": 1
            }
        },
        "origins:dimension": {
            "dimension": {
                "name": "Dimension",
                "type": "ns",
                "desc": "ID of the dimension the entity needs to be in for this condition to evaluate to true. Vanilla dimensions are minecraft:overworld, minecraft:the_nether and minecraft:the_end, but IDs of custom/modded dimensions should also work."
            }
        },
        "origins:biome": {
            "biome": {
                "name": "Biome",
                "type": "ns",
                "desc": "If set, this is the ID of the biome the entity needs to be in for this condition to evaluate to true, e.g. minecraft:savannah. Click to see a list of vanilla biome ids.",
                "link": "https://minecraft.gamepedia.com/Biome/ID"
            },
            "biomes": {
                "name": "Biomes",
                "type": "textlist",
                "desc": "If set, these are the allowed biome IDs the entity can be in for this condition to evaluate to true (split by line). Click to see a list of vanilla biome ids.",
                "link": "https://minecraft.gamepedia.com/Biome/ID",
            },
            "condition": biome_condition
        },
        "origins:xp_levels": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How the experience level of the player should be compared to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "XP Level",
                "type": "int",
                "desc": "Which value the experience level should be compared to.",
                "default": 1
            }
        },
        "origins:xp_points": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How the experience points of the player should be compared to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "XP Points",
                "type": "int",
                "desc": "Which value the experience points should be compared to.",
                "default": 100
            }
        },
        "origins:health": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How the health of the entity should be compared to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Health",
                "type": "double",
                "desc": "Which value the health should be compared to.",
                "default": 0.0
            }
        },
        "origins:relative_health": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How the relative health of the entity should be compared to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Relative Health",
                "type": "double",
                "desc": "Which value the relative health should be compared to.",
                "default": 0.0
            }
        },
        "origins:entity_type": {
            "entity_type": {
                "name": "Entity ID",
                "type": "ns",
                "desc": "ID of the entity type the entity needs to have to pass the check. Click to see a list of all vanilla entity ids.",
                "link": "https://minecraft.gamepedia.com/Java_Edition_data_values#Entities"
            }
        },
        "origins:entity_group": {
            "entity_group": {
                "name": "Entity Group",
                "type": "ns",
                "desc": "Entity group required for the entity to pass the check. In vanilla this is one of 'default', 'undead', 'arthropod', 'illager' or 'aquatic'."
            }
        },
        "origins:collided_horizontally": {},
        "origins:in_tag": {
            "tag": {
                "name": "Entity ID",
                "type": "ns",
                "desc": "ID of the tag the entity type needs to be in to pass the check.",
            }
        },
        "origins:in_block_anywhere": {
            "block_condition": block_condition,
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How the number of blocks which overlap and fulfill block_condition should be compared to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Block Count",
                "type": "int",
                "desc": "The value to compare the number to.",
                "default": 1
            }
        },
        "origins:fall_distance": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How the fall distance should be compared to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Fall Distance",
                "type": "double",
                "desc": "The value to compare the fall distance to. Note that the fall distance is 0 if the player has slow falling.",
                "default": 1.0
            }
        },
        "origins:command": {
            "command": {
                "name": "Command",
                "type": "textarea",
                "desc": "Command to run. For commands that don't return a numeric value, they return 1 on success and 0 on failure.",
                "size": true
            },
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How to compare the command's result to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Result",
                "type": "int",
                "desc": "Which value to compare the command's result to.",
                "default": 1
            },
            "permission_level": {
                "name": "Permission Level",
                "type": "int",
                "desc": 'The permission level to use for the command. 0 is a "survival player", anything higher emulates some form of operator. See Minecraft Wiki (op-permission-level) for details (click).',
                "default": 4,
                "link": "https://minecraft.gamepedia.com/Server.properties#op-permission-level"
            }
        },
        "origins:scoreboard": {
            "objective": {
                "name": "Objective",
                "type": "text",
                "desc": "The name of the scoreboard objective to retrieve the value from and compare."
            },
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How to compare the objective's value to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Score",
                "type": "int",
                "desc": "Which value to compare the objective's value to.",
                "default": 1
            }
        },
        "origins:predicate": {
            "predicate": {
                "name": "Predicate",
                "type": "ns",
                "desc": "ID of the predicate the entity needs to pass. Click to learn about predicates.",
                "link": "https://minecraft.gamepedia.com/Predicate"
            }
        }
    }
};
var tick_rate = {
    "name": "Tick Rate",
    "type": "int",
    "desc": "The frequency (in ticks) with which to check the condition. Lower values mean the condition changes are detected more quickly, but this comes at a potentially huge performance cost.",
    "default": 20
};

block_condition_data.type = {
    "name": "Type",
    "type": "options",
    "desc": "The most important field in the condition. Specifies an ID of a condition to check for.",
    "more": "__type_options",
    "link": "https://github.com/apace100/origins-fabric/wiki/List-of-block-conditions"
};
block_condition_data.inverted = {
    "name": "Inverted",
    "type": "checkbox",
    "desc": "If set to true, Origins will instead check that this condition is NOT fulfilled."
};
block_condition_data.__type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "origins:constant": {
            "value": {
                "name": "Value",
                "type": "checkbox",
                "default": false
            }
        },
        "origins:and": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "All of these need to evaluate to true in order for the whole condition to be true.",
                "data": block_condition_data
            }
        },
        "origins:or": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "At least one of these need to evaluate to true in order for the whole condition to be true.",
                "data": block_condition_data
            }
        },
        "origins:height": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": 'How the Y position of the block should be compared to the specified value.',
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Y Level",
                "type": "int",
                "desc": "The value to compare the Y position of the block to.",
                "default": 60
            }
        },
        "origins:block": {
            "block": {
                "name": "Block",
                "type": "ns",
                "desc": "ID of the block that this block needs to be to pass the check."
            }
        },
        "origins:in_tag": {
            "tag": {
                "name": "Block Tag",
                "type": "ns",
                "desc": "ID of the tag which the block should be in to pass the check."
            }
        },
        "origins:adjacent": {
            "adjacent_condition": {
                "name": "Adjacent Condition",
                "type": "sub",
                "desc": "The block condition that needs to be fulfilled by adjacent blocks to count towards this condition.",
                "data": block_condition_data,
                "hidden": true
            },
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": 'How the number of adjacent blocks which fulfill adjacent_condition should be compared to the specified value.',
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Block Count",
                "type": "int",
                "desc": "The value to compare the number to.",
                "default": 1
            }
        },
        "origins:replacable": {},
        "origins:attachable": {},
        "origins:offset": {
            "condition": block_condition,
            "x": {
                "name": "X Offset",
                "type": "int",
                "desc": "How much to offset the position on the x-axis.",
                "default": 0
            },
            "y": {
                "name": "Y Offset",
                "type": "int",
                "desc": "How much to offset the position on the y-axis.",
                "default": 0
            },
            "z": {
                "name": "Z Offset",
                "type": "int",
                "desc": "How much to offset the position on the z-axis.",
                "default": 0
            }
        },
        "origins:fluid": {
            "fluid_condition": fluid_condition
        },
        "origins:movement_blocking": {},
        "origins:light_blocking": {},
        "origins:water_loggable": {}
    }
};

item_condition_data.type = {
    "name": "Type",
    "type": "options",
    "desc": "The most important field in the condition. Specifies an ID of a condition to check for.",
    "more": "__type_options",
    "link": "https://github.com/apace100/origins-fabric/wiki/List-of-item-conditions"
};
item_condition_data.inverted = {
    "name": "Inverted",
    "type": "checkbox",
    "desc": "If set to true, Origins will instead check that this condition is NOT fulfilled."
};
item_condition_data.__type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "origins:constant": {
            "value": {
                "name": "Value",
                "type": "checkbox",
                "default": false
            }
        },
        "origins:and": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "All of these need to evaluate to true in order for the whole condition to be true.",
                "data": item_condition_data
            }
        },
        "origins:or": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "At least one of these need to evaluate to true in order for the whole condition to be true.",
                "data": item_condition_data
            }
        },
        "origins:food": {},
        "origins:ingredient": {
            "ingredient": {
                "name": "Ingredient",
                "type": "sub",
                "desc": "The ingredient this item must match to pass the check.",
                "data": {
                    "item": {
                        "name": "Item",
                        "type": "ns",
                        "desc": "An item ID."
                    },
                    "tag": {
                        "name": "Item Tag",
                        "type": "ns",
                        "desc": "An item tag. Ignored if Item is present."
                    }
                }
            }
        },
        "origins:armor_value": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How to compare the item's armor value to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Armor Value",
                "type": "int",
                "desc": "The value to compare the item's armor value to.",
                "default": 5
            }
        },
        "origins:harvest_level": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How to compare the item's harvest level to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Harvest Level",
                "type": "int",
                "desc": "The value to compare the item's harvest level to.",
                "default": 0
            }
        },
        "origins:enchantment": {
            "enchantment": {
                "name": "Enchantment ID",
                "type": "ns",
                "desc": "ID of the enchantment of interest, e.g. minecraft:protection."
            },
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How to compare the item's enchantment level to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="],
                "default": ">="
            },
            "compare_to": {
                "name": "Enchantment Level",
                "type": "int",
                "desc": "The value to compare the item's enchantment level to.",
                "default": 1
            }
        },
        "origins:meat": {}
    }
};

damage_condition_data.type = {
    "name": "Type",
    "type": "options",
    "desc": "The most important field in the condition. Specifies an ID of a condition to check for.",
    "more": "__type_options",
    "link": "https://github.com/apace100/origins-fabric/wiki/List-of-damage-conditions"
};
damage_condition_data.inverted = {
    "name": "Inverted",
    "type": "checkbox",
    "desc": "If set to true, Origins will instead check that this condition is NOT fulfilled."
};
damage_condition_data.__type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "origins:constant": {
            "value": {
                "name": "Value",
                "type": "checkbox",
                "default": false
            }
        },
        "origins:and": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "All of these need to evaluate to true in order for the whole condition to be true.",
                "data": damage_condition_data
            }
        },
        "origins:or": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "At least one of these need to evaluate to true in order for the whole condition to be true.",
                "data": damage_condition_data
            }
        },
        "origins:amount": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How to compare the amount of damage to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Damage",
                "type": "double",
                "desc": "The value to compare the amount of damage to.",
                "default": 1.0
            }
        },
        "origins:fire": {},
        "origins:name": {
            "name": {
                "name": "Source",
                "type": "text",
                "desc": "Name the damage source should have to pass the check. See the wiki for more information."
            }
        },
        "origins:projectile": {
            "projectile": {
                "name": "Projectile",
                "type": "ns",
                "desc": "If set, the check will only pass if the projectile was of an entity type with this ID."
            }
        },
        "origins:attacker": {
            "entity_condition": condition
        }
    }
};

fluid_condition_data.type = {
    "name": "Type",
    "type": "options",
    "desc": "The most important field in the condition. Specifies an ID of a condition to check for.",
    "more": "__type_options",
    "link": "https://github.com/apace100/origins-fabric/wiki/List-of-fluid-conditions"
};
fluid_condition_data.inverted = {
    "name": "Inverted",
    "type": "checkbox",
    "desc": "If set to true, Origins will instead check that this condition is NOT fulfilled."
};
fluid_condition_data.__type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "origins:constant": {
            "value": {
                "name": "Value",
                "type": "checkbox",
                "default": false
            }
        },
        "origins:and": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "All of these need to evaluate to true in order for the whole condition to be true.",
                "data": fluid_condition_data
            }
        },
        "origins:or": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "At least one of these need to evaluate to true in order for the whole condition to be true.",
                "data": fluid_condition_data
            }
        },
        "origins:empty": {},
        "origins:still": {},
        "origins:in_tag": {
            "tag": {
                "name": "Fluid Tag",
                "type": "ns",
                "desc": "ID of the tag which the fluid should be in to pass the check."
            }
        }
    }
};

biome_condition_data.type = {
    "name": "Type",
    "type": "options",
    "desc": "The most important field in the condition. Specifies an ID of a condition to check for.",
    "more": "__type_options",
    "link": "https://github.com/apace100/origins-fabric/wiki/List-of-biome-conditions"
}
biome_condition_data.inverted = {
    "name": "Inverted",
    "type": "checkbox",
    "desc": "If set to true, Origins will instead check that this condition is NOT fulfilled."
}
biome_condition_data.__type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "origins:constant": {
            "value": {
                "name": "Value",
                "type": "checkbox",
                "default": false
            }
        },
        "origins:and": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "All of these need to evaluate to true in order for the whole condition to be true.",
                "data": biome_condition_data
            }
        },
        "origins:or": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "At least one of these need to evaluate to true in order for the whole condition to be true.",
                "data": biome_condition_data
            }
        },
        "origins:high_humidity": {},
        "origins:temperature": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": "How the temperature should be compared to the specified value.",
                "options": ["<", ">", ">=", "<=", "==", "!="]
            },
            "compare_to": {
                "name": "Temperature",
                "type": "double",
                "desc": "Which value the temperature should be compared to.",
                "default": 1.0
            }
        },
        "origins:category": {
            "category": {
                "name": "Category",
                "type": "ns",
                "desc": "Which category the biome must be in order to succeed the check. Click to see list of biome categories.",
                "link": "https://github.com/apace100/origins-fabric/wiki/List-of-biome-categories"
            }
        },
        "origins:precipitation": {
            "precipitation": {
                "name": "Precipitation",
                "type": "ns",
                "desc": "Which precipitation the biome has to have in order to succeed the check. In vanilla, one of 'none', 'rain' or 'snow'."
            }
        }
    }
}

var key_form = {
    "name": "Key",
    "type": "sub",
    "desc": "A data type used in active powers to define which key they should react to.",
    "link": "https://github.com/apace100/origins-fabric/wiki/Key",
    "data": {
        "key": {
            "name": "Key",
            "type": "text",
            "desc": "A string specifying the keybinding. Click to see list of vanilla/origins keybindings.",
            "link": "https://github.com/apace100/origins-fabric/wiki/List-of-keybindings"
        },
        "continuous": {
            "name": "Continuous",
            "type": "checkbox",
            "desc": "Whether the keybinding should only trigger the power on the first frame the key is held down, or, if set to true, continuously on each frame while the key is held."
        }
    }
};
var cooldown = {
    "name": "Cooldown",
    "type": "int",
    "desc": "Cooldown duration in ticks.",
    "default": 200
};
var amodifier = {
    "operation": {
        "name": "Operation",
        "type": "options",
        "desc": "The operation which will be performed by this modifier.",
        "options": ["addition", "multiply_base", "multiply_total"]
    },
    "value": {
        "name": "Value",
        "type": "double",
        "desc": "The value with which to apply the operation to the attribute.",
        "default": 0.0
    },
    "name": {
        "name": "Name",
        "type": "text",
        "desc": "A descriptive name for the modifier, describing where it comes from."
    }
};
var aamodifier = Object.assign({}, amodifier);
aamodifier.attribute = {
    "name": "Attribute ID",
    "type": "ns",
    "desc": "ID of the attribute which will be modified by this modifier."
};

var hud_render = {
    "name": "HUD",
    "type": "sub",
    "desc": "Specifies how and if a cooldown bar is rendered.",
    "link": "https://github.com/apace100/origins-fabric/wiki/Hud-Render",
    "data": {
        "should_render": {
            "name": "Render",
            "type": "checkbox",
            "desc": "Whether the bar should actually be visible.",
            "default": true
        },
        "sprite_location": {
            "name": "Sprite",
            "type": "ns",
            "desc": "The path to the file in the resource pack which contains what the bar looks like.",
            "default": "origins:textures/gui/resource_bar.png"
        },
        "bar_index": {
            "name": "Bar Index",
            "type": "int",
            "desc": "The indexed position of the bar on the sprite to use."
        },
        "condition": condition
    }
};
var status_effect_data = {
    "effect": {
        "name": "Effect",
        "type": "ns",
        "desc": "ID of the status effect."
    },
    "duration": {
        "name": "Duration",
        "type": "int",
        "desc": "Duration of the status effect in ticks.",
        "default": 100
    },
    "amplifier": {
        "name": "Amplifier",
        "type": "int",
        "desc": "Amplifier of the status effect.",
        "default": 0
    },
    "is_ambient": {
        "name": "Ambient",
        "type": "checkbox",
        "desc": "Whether the effect counts as an ambient effect."
    },
    "show_particles": {
        "name": "Show Particles",
        "type": "checkbox",
        "desc": "Whether the status effect will spawn particles on the entity.",
        "default": true
    },
    "show_icon": {
        "name": "Show Icon",
        "type": "checkbox",
        "desc": "Whether the status effect will show an icon on the HUD.",
        "default": true
    }
}
var status_effect = {
    "name": "Status Effect",
    "type": "sub",
    "desc": "If set, this status effect will be applied.",
    "data": status_effect_data
};
var status_effects = {
    "name": "Status Effects",
    "type": "list",
    "desc": "If set, all of these status effects will be applied.",
    "data": status_effect_data
};

var damage_source_names = ['inFire', 'lightningBolt', 'onFire', 'lava', 'hotFloor', 'inWall', 'cramming', 'drown', 'starve', 'cactus', 'fall', 'flyIntoWall', 'outOfWorld', 'generic', 'magic', 'wither', 'anvil', 'fallingBlock', 'dragonBreath', 'dryout', 'sweetBerryBush', 'sting', 'mob', 'player', 'arrow', 'trident', 'fireworks', 'witherSkull', 'thrown', 'indirectMagic', 'thorns', 'explosion.player', 'explosion', 'badRespawnPoint'];

var damage_source = {
    "name": "Damage Source",
    "type": "sub",
    "desc": "Defines how to damage is dealt to an entity.",
    "data": {
        "name": {
            "name": "Source",
            "type": "text",
            "desc": "Name the damage source should have to pass the check. See the wiki for more information."
        },
        "bypasses_armor": {
            "name": "Bypass Armor",
            "type": "checkbox",
            "desc": "When true, armor values are not taken into account when calculating the actual damage amount taken."
        },
        "fire": {
            "name": "Fire",
            "type": "checkbox",
            "desc": "When true, the damage will be considered fire damage."
        },
        "unblockable": {
            "name": "Unblockable",
            "type": "checkbox",
            "desc": "When true, the damage will be unblockable (not reduced by resistance effects or protection enchantments)."
        },
        "magic": {
            "name": "Magic",
            "type": "checkbox",
            "desc": "When true, the damage will be considered magic damage."
        },
        "out_of_world": {
            "name": "Out of World",
            "type": "checkbox",
            "desc": 'When true, the damage will be considered "out of world" damage, i.e. damage from falling into the void.'
        }
    }
};

var positioned_item_stack = {
    "item": {
        "name": "Item ID",
        "type": "text",
        "desc": "ID of the item."
    },
    "amount": {
        "name": "Amount",
        "type": "int",
        "desc": "Size of the item stack.",
        "default": 1
    },
    "tag": {
        "name": "NBT",
        "type": "textarea",
        "desc": "NBT data of the item."
    },
    "slot": {
        "name": "Slot",
        "type": "int",
        "desc": "A numerical slot ID, used to position the stack in inventories."
    }
};

var entity_action_data = {};
var entity_action = {
    "name": "Entity Action",
    "type": "sub",
    "desc": "An action performed on the entity relevant to this situation.",
    "data": entity_action_data
};

var block_action_data = {};
var block_action = {
    "name": "Block Action",
    "type": "sub",
    "desc": "An action performed on the block relevant to this situation.",
    "data": block_action_data
};

var item_action_data = {};
var item_action = {
    "name": "Item Action",
    "type": "sub",
    "desc": "An action performed on the item relevant to this situation.",
    "data": item_action_data
};

entity_action_data.type = {
    "name": "Type",
    "type": "options",
    "desc": "The type of entity action.",
    "more": "__type_options"
};
entity_action_data.__type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "origins:and": {
            "actions": {
                "name": "Actions",
                "type": "list",
                "desc": "All of these will be executed one after the other.",
                "data": entity_action_data
            }
        },
        "origins:chance": {
            "action": {
                "name": "Action",
                "type": "sub",
                "desc": "The action which might be executed.",
                "data": entity_action_data
            },
            "chance": {
                "name": "Chance",
                "type": "double",
                "desc": "The chance that the action will execute, from 0 to 1. (E.g. 0.1 means 10% chance, 0.95 means 95% chance)",
                "default": 0.5
            }
        },
        "origins:if_else": {
            "condition": condition,
            "if_action": {
                "name": "If Action",
                "type": "sub",
                "desc": "The action which is executed when the condition evaluates to true.",
                "data": entity_action_data
            },
            "else_action": {
                "name": "Else Action",
                "type": "sub",
                "desc": "If present, this action will be executed when the condition evaluates to false. It is optional.",
                "data": entity_action_data
            }
        },
        "origins:if_else_list": {
            "actions": {
                "name": "Actions",
                "type": "list",
                "desc": "A list of actions associated with conditions, and executes the first one in the list for which the condition holds. Basically a less indentation-heavy way to represent a deeply nested If Else Action.",
                "data": {
                    "condition": condition,
                    "action": entity_action
                }
            }
        },
        "origins:choice": {
            "actions": {
                "name": "Actions",
                "type": "list",
                "desc": "One of these will be chosen randomly based on the weight.",
                "data": {
                    "element": entity_action,
                    "weight": {
                        "name": "Weight",
                        "type": "int",
                        "desc": "The likelihood power of this element being picked. Percent of being picked is weight/total_weight_of_list",
                        "default": 10
                    }
                }
            }
        },
        "origins:delay": {
            "action": entity_action,
            "ticks": {
                "name": "Delay",
                "type": "int",
                "desc": "The delay in ticks before the action is executed."
            }
        },
        "origins:damage": {
            "amount": {
                "name": "Amount",
                "type": "double",
                "desc": "The amount of damage to deal.",
                "default": 2.0
            },
            "source": damage_source
        },
        "origins:heal": {
            "amount": {
                "name": "Amount",
                "type": "double",
                "desc": "The amount of health to restore.",
                "default": 2.0
            }
        },
        "origins:exhaust": {
            "amount": {
                "name": "Amount",
                "type": "double",
                "desc": "The amount of exhaustion to apply to the player.",
                "default": 1.0
            }
        },
        "origins:apply_effect": {
            "effect": status_effect,
            "effects": status_effects
        },
        "origins:clear_effect": {
            "effect": {
                "name": "Effect ID",
                "type": "ns",
                "desc": "If specified, the effect with this ID will be cleared. If not specified, all effects will be cleared. It is optional."
            }
        },
        "origins:set_on_fire": {
            "duration": {
                "name": "Set on Fire",
                "type": "int",
                "desc": "The amount of seconds the entity should burn.",
                "default": 5
            }
        },
        "origins:add_velocity": {
            "x": {
                "name": "X Velocity",
                "type": "double",
                "desc": "The amount of velocity to add on the x-axis."
            },
            "y": {
                "name": "Y Velocity",
                "type": "double",
                "desc": "The amount of velocity to add on the y-axis."
            },
            "z": {
                "name": "Z Velocity",
                "type": "double",
                "desc": "The amount of velocity to add on the z-axis."
            },
            "space": {
                "name": "Space",
                "type": "options",
                "options": ["world", "local", "velocity", "velocity_normalized", "velocity_horizontal", "velocity_horizontal_normalized"],
                "desc": 'A space is a string which defines which coordinate system is used for directions, currently it\'s only used in Add Velocity. This means a space defines what "y" and "z" mean. Click to see the wiki.',
                "link": "https://github.com/apace100/origins-fabric/wiki/Space"
            }
        },
        "origins:spawn_entity": {
            "entity_type": {
                "name": "Entity ID",
                "type": "ns",
                "desc": "The ID of the entity type that will be spawned."
            },
            "tag": {
                "name": "NBT",
                "type": "textarea",
                "desc": "When set, this NBT data will be applied to the new entity when it is spawned."
            },
            "entity_action": {
                "name": "Spawn Action",
                "type": "sub",
                "desc": "When set, this action will be executed on the new entity when it is spawned.",
                "data": entity_action_data
            }
        },
        "origins:gain_air": {
            "value": {
                "name": "Air",
                "type": "int",
                "desc": "The amount of breath to restore in (about) ticks.",
                "default": 20
            }
        },
        "origins:block_action_at": {
            "block_action": block_action
        },
        "origins:spawn_effect_cloud": {
            "radius": {
                "name": "Radius",
                "type": "double",
                "desc": "The radius of the cloud.",
                "default": 3.0
            },
            "radius_on_use": {
                "name": "Radius Change",
                "type": "double",
                "desc": "How much the radius should change when an effect is applied.",
                "default": -0.5
            },
            "value": {
                "name": "Wait Time",
                "type": "int",
                "desc": "How many ticks to wait until the cloud takes effect.",
                "default": 10
            },
            "effect": status_effect,
            "effects": status_effects
        },
        "origins:extinguish": {},
        "origins:execute_command": {
            "command": {
                "name": "Command",
                "type": "textarea",
                "desc": "The command to execute (from the perspective of the entity!).",
                "size": true
            },
            "permission_level": {
                "name": "Permission Level",
                "type": "int",
                "desc": 'The permission level to use for the command. 0 is a "survival player", anything higher emulates some form of operator. See Minecraft Wiki (op-permission-level) for details (click).',
                "default": 4,
                "link": "https://minecraft.gamepedia.com/Server.properties#op-permission-level"
            }
        },
        "origins:change_resource": {
            "resource": {
                "name": "Resource",
                "type": "ns",
                "desc": "ID of the power type that defines the resource. Must be a Resource (Power Type) which exists on the player."
            },
            "change": {
                "name": "New Value",
                "type": "int",
                "desc": "This value will be added to the resource (won't go below min or above max of the Resource (Power Type))."
            }
        },
        "origins:feed": {
            "food": {
                "name": "Food",
                "type": "int",
                "desc": "The food amount to restore."
            },
            "saturation": {
                "name": "Saturation",
                "type": "double",
                "desc": "The saturation amount to restore."
            }
        },
        "origins:add_xp": {
            "points": {
                "name": "Points",
                "type": "int",
                "desc": "If set, this is the amount experience points that will be given to the player. Can not be negative."
            },
            "levels": {
                "name": "Levels",
                "type": "int",
                "desc": "If set, this is the amount experience levels that will be given to the player. Can be negative and thus used to subtract levels."
            }
        }
    }
}

block_action_data.type = {
    "name": "Type",
    "type": "options",
    "desc": "The type of block action.",
    "more": "__type_options"
};
block_action_data.__type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "origins:and": {
            "actions": {
                "name": "Actions",
                "type": "list",
                "desc": "All of these will be executed one after the other.",
                "data": block_action_data
            }
        },
        "origins:chance": {
            "action": {
                "name": "Action",
                "type": "sub",
                "desc": "The action which might be executed.",
                "data": block_action_data
            },
            "chance": {
                "name": "Chance",
                "type": "double",
                "desc": "The chance that the action will execute, from 0 to 1. (E.g. 0.1 means 10% chance, 0.95 means 95% chance)",
                "default": 0.5
            }
        },
        "origins:if_else": {
            "condition": block_condition,
            "if_action": {
                "name": "If Action",
                "type": "sub",
                "desc": "The action which is executed when the condition evaluates to true.",
                "data": block_action_data
            },
            "else_action": {
                "name": "Else Action",
                "type": "sub",
                "desc": "If present, this action will be executed when the condition evaluates to false. It is optional.",
                "data": block_action_data
            }
        },
        "origins:choice": {
            "actions": {
                "name": "Actions",
                "type": "list",
                "desc": "One of these will be chosen randomly based on the weight.",
                "data": {
                    "element": block_action,
                    "weight": {
                        "name": "Weight",
                        "type": "int",
                        "desc": "The likelihood power of this element being picked. Percent of being picked is weight/total_weight_of_list",
                        "default": 10
                    }
                }
            }
        },
        "origins:set_block": {
            "block": {
                "name": "Block ID",
                "type": "ns",
                "desc": "The ID of the block to place."
            }
        },
        "origins:add_block": {
            "block": {
                "name": "Block ID",
                "type": "ns",
                "desc": "The ID of the block to place."
            }
        },
        "origins:offset": {
            "action": block_action,
            "x": {
                "name": "X Offset",
                "type": "int",
                "desc": "How much to offset the position on the x-axis.",
                "default": 0
            },
            "y": {
                "name": "Y Offset",
                "type": "int",
                "desc": "How much to offset the position on the y-axis.",
                "default": 0
            },
            "z": {
                "name": "Z Offset",
                "type": "int",
                "desc": "How much to offset the position on the z-axis.",
                "default": 0
            }
        }
    }
}

item_action_data.type = {
    "name": "Type",
    "type": "options",
    "desc": "The type of item action.",
    "more": "__type_options"
};
item_action_data.__type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "origins:and": {
            "actions": {
                "name": "Actions",
                "type": "list",
                "desc": "All of these will be executed one after the other.",
                "data": item_action_data
            }
        },
        "origins:chance": {
            "action": {
                "name": "Action",
                "type": "sub",
                "desc": "The action which might be executed.",
                "data": item_action_data
            },
            "chance": {
                "name": "Chance",
                "type": "double",
                "desc": "The chance that the action will execute, from 0 to 1. (E.g. 0.1 means 10% chance, 0.95 means 95% chance)",
                "default": 0.5
            }
        },
        "origins:if_else": {
            "condition": item_condition,
            "if_action": {
                "name": "If Action",
                "type": "sub",
                "desc": "The action which is executed when the condition evaluates to true.",
                "data": item_action_data
            },
            "else_action": {
                "name": "Else Action",
                "type": "sub",
                "desc": "If present, this action will be executed when the condition evaluates to false. It is optional.",
                "data": item_action_data
            }
        },
        "origins:choice": {
            "actions": {
                "name": "Actions",
                "type": "list",
                "desc": "One of these will be chosen randomly based on the weight.",
                "data": {
                    "element": item_action,
                    "weight": {
                        "name": "Weight",
                        "type": "int",
                        "desc": "The likelihood power of this element being picked. Percent of being picked is weight/total_weight_of_list",
                        "default": 10
                    }
                }
            }
        },
        "origins:consume": {
            "amount": {
                "name": "Amount",
                "type": "int",
                "desc": "The amount of items to remove.",
                "default": 1
            }
        }
    }
};

var power_copy = {};
var power_data = {
    "info": {
        "type": "info",
        "info": "<a href='https://github.com/apace100/origins-fabric/wiki/Defining-a-power-in-JSON'>Wiki Format</a>"
    },
    "name": {
        "name": "Name",
        "type": "text",
        "desc": "When defined, this is the translation key (or literal text) that will be used as the name of the power, instead of the default generated one."
    },
    "description": {
        "name": "Description",
        "type": "textarea",
        "desc": "When defined, this is the translation key (or literal text) that will be used as the description of the power, instead of the default generated one."
    },
    "loading_priority": {
        "name": "Load Priority",
        "type": "int",
        "desc": "Powers with higher loading priority override powers registered under the same ID with a lower loading priority. Use a value greater than 0 if you want to override powers added by the mod itself.",
        "default": 0
    },
    "hidden": {
        "name": "Hidden",
        "type": "bool",
        "desc": "If set to true, this power will not show up in the list of powers an origin has. This is by default false, but defaults to true if it is a sub-power in an origins:multiple power type."
    },
    "condition": {
        "name": "Condition",
        "type": "sub",
        "desc": "A player condition that this power has to match in order to work properly. Powers normally support this condition unless otherwise specified.",
        "data": condition_data,
        "link": "https://github.com/apace100/origins-fabric/wiki/Entity-Condition"
    },
    "type": {
        "name": "Type",
        "type": "options",
        "desc": "The most important field. ID of a power type, defining how this power behaves and which other fields are required. Check the wiki for more information.",
        "more": "__type_options"
    },
    "__type_options": {
        "type": "more",
        "desc": "Options specific to the type of power.",
        "parent": "type",
        "data": {
            "origins:simple": {},
            "origins:multiple": {
                "o__": { // o__ basically supports "the rest"
                    "name": "Powers",
                    "type": "nlist",
                    "ignore": ["name", "description", "loading_priority", "hidden", "condition", "type", "__type_options"],
                    "desc": 'Named list of multiple powers. Do not name a subpower "name", "description", "loading_priority", "hidden", "condition", "type", or "__type_options", as they will overwrite other data.',
                    "data": power_copy
                }
            },
            "origins:toggle": {
                "active_by_default": {
                    "name": "Active by Default",
                    "type": "checkbox",
                    "desc": "Whether this power starts in the on or off state.",
                    "default": true
                },
                "key": key_form
            },
            "origins:attribute": {
                "modifier": {
                    "name": "AA Modifier",
                    "type": "sub",
                    "desc": "If specified, this modifier will be applied to their corresponding attribute. DOES NOT SUPPORT CONDITION",
                    "data": aamodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attributed-Attribute-Modifier"
                },
                "modifiers": {
                    "name": "AA Modifiers",
                    "type": "list",
                    "desc": "If specified, these modifiers will be applied to their corresponding attributes. DOES NOT SUPPORT CONDITION.",
                    "data": aamodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attributed-Attribute-Modifier"
                }
            },
            "origins:conditioned_attribute": {
                "tick_rate": tick_rate,
                "modifier": {
                    "name": "AA Modifier",
                    "type": "sub",
                    "desc": "If specified, this modifier will be applied to their corresponding attribute.",
                    "data": aamodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attributed-Attribute-Modifier"
                },
                "modifiers": {
                    "name": "AA Modifiers",
                    "type": "list",
                    "desc": "If specified, these modifiers will be applied to their corresponding attributes.",
                    "data": aamodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attributed-Attribute-Modifier"
                }
            },
            "origins:burn": {
                "interval": {
                    "name": "Interval",
                    "type": "int",
                    "desc": "Interval between being set on fire, in ticks.",
                    "default": 20
                },
                "burn_duration": {
                    "name": "Burn Duration",
                    "type": "int",
                    "desc": "Time the fire should last on the player each time it is set, in seconds.",
                    "default": 2
                }
            },
            "origins:cooldown": {
                "cooldown": cooldown,
                "hud_render": hud_render
            },
            "origins:effect_immunity": {
                "effect": {
                    "name": "Effect",
                    "type": "ns",
                    "desc": "If specified, the effect with this ID can not be applied to the player. Click to see a list of vanilla effect ids.",
                    "link": "https://minecraft.gamepedia.com/Effect#Effect_IDs"
                },
                "effects": {
                    "name": "Effects",
                    "type": "textlist",
                    "desc": "If specified, the effects with these IDs can not be applied to the player. Each line must have a valid effect ID. Click to see a list of vanilla effect ids.",
                    "link": "https://minecraft.gamepedia.com/Effect#Effect_IDs"
                }
            },
            "origins:elytra_flight": {
                "render_elytra": {
                    "name": "Render Elytra",
                    "type": "checkbox",
                    "desc": "Whether an Elytra should render on the player's back while this power is active.",
                    "default": true
                }
            },
            "origins:entity_group": {
                "group": {
                    "name": "Entity Group",
                    "type": "options",
                    "desc": "The entity group of the player, mostly used for determining enchantment bonus damage towards the player. A player should only have one of these powers.",
                    "options": ["default", "undead", "arthropod", "illager", "aquatic"]
                }
            },
            "origins:exhaust": {
                "interval": {
                    "name": "Interval",
                    "type": "int",
                    "desc": "The number of ticks to wait between applying exhaustion.",
                    "default": 100
                },
                "exhaustion": {
                    "name": "Exhaustion",
                    "type": "double",
                    "desc": "The amount of exhaustion to apply each interval.",
                    "default": 1.0
                }
            },
            "origins:fire_projectile": {
                "entity_type": {
                    "name": "Entity ID",
                    "type": "ns",
                    "desc": "The ID of the projectile entity type that will be fired."
                },
                "cooldown": cooldown,
                "count": {
                    "name": "Projectile Count",
                    "type": "int",
                    "desc": "The amount of projectiles to fire each use.",
                    "default": 1
                },
                "speed": {
                    "name": "Speed",
                    "type": "double",
                    "desc": "The speed applied to the fired projectile",
                    "default": 1.5
                },
                "divergence": {
                    "name": "Spread",
                    "type": "double",
                    "desc": "How much each projectile fired is affected by random spread.",
                    "default": 1.0
                },
                "sound": {
                    "name": "Sound",
                    "type": "ns",
                    "desc": "When defined, this is the ID of the sound event that will be played when the power is used."
                },
                "hud_render": hud_render,
                "tag": {
                    "name": "Projectile NBT",
                    "type": "textarea",
                    "desc": "NBT data of the entity."
                },
                "key": key_form
            },
            "origins:inventory": {
                "name": {
                    "name": "Name",
                    "type": "text",
                    "desc": "The translation key or literal text to use as the display name for the inventory.",
                    "default": "container.inventory"
                },
                "drop_on_death": {
                    "name": "Drop on Death",
                    "type": "checkbox",
                    "desc": "When this is set to true, the player will drop the items in the inventory on death (vanishing items will vanish!)."
                },
                "drop_on_death_filter": {
                    "name": "Drop Filter",
                    "type": "sub",
                    "desc": "If this is set, only item stacks matching this condition will be dropped on death.",
                    "data": item_condition_data,
                    "hidden": true
                },
                "key": key_form
            },
            "origins:invisibility": {
                "render_armor": {
                    "name": "Render Armor",
                    "type": "checkbox",
                    "desc": "Whether or not the player's armor should be shown.",
                    "default": true
                }
            },
            "origins:invulnerability": {
                "damage_condition": {
                    "name": "Damage Condition",
                    "type": "sub",
                    "desc": "Specifies which damage the player will be immune to. Does NOT support conditions depending on the damage amount, as this is a generic invulnerability power. Use Modify Damage Taken with an Attribute Modifier which multiplies by 0 if you need that.",
                    "data": damage_condition_data
                }
            },
            "origins:launch": {
                "cooldown": cooldown,
                "speed": {
                    "name": "Speed",
                    "type": "double",
                    "desc": "The speed applied to the player in the upwards direction."
                },
                "sound": {
                    "name": "Sound",
                    "type": "ns",
                    "desc": "When defined, this is the ID of the sound event that will be played when the power is used."
                },
                "hud_render": hud_render,
                "key": key_form
            },
            "origins:model_color": {
                "red": {
                    "name": "Red",
                    "type": "double",
                    "desc": "Value by which the red component of the texture will be multiplied. Range: 0 - 1.",
                    "default": 1.0
                },
                "green": {
                    "name": "Green",
                    "type": "double",
                    "desc": "Value by which the green component of the texture will be multiplied. Range: 0 - 1.",
                    "default": 1.0
                },
                "blue": {
                    "name": "Blue",
                    "type": "double",
                    "desc": "Value by which the blue component of the texture will be multiplied. Range: 0 - 1.",
                    "default": 1.0
                },
                "alpha": {
                    "name": "Alpha",
                    "type": "double",
                    "desc": "Value by which the alpha component of the texture will be multiplied. Range: 0 - 1.",
                    "default": 1.0
                }
            },
            "origins:modify_break_speed": {
                "block_condition": block_condition,
                "modifier": {
                    "name": "AA Modifier",
                    "type": "sub",
                    "desc": "If set, this modifier will apply to the break speed.",
                    "data": aamodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attributed-Attribute-Modifier"
                },
                "modifiers": {
                    "name": "Modifiers",
                    "type": "list",
                    "desc": "If set, these modifiers will apply to the break speed.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                }
            },
            "origins:modify_damage_dealt": {
                "damage_condition": damage_condition,
                "modifier": {
                    "name": "AA Modifier",
                    "type": "sub",
                    "desc": "IIf set, this modifier will apply to the damage dealt.",
                    "data": aamodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attributed-Attribute-Modifier"
                },
                "modifiers": {
                    "name": "Modifiers",
                    "type": "list",
                    "desc": "If set, these modifiers will apply to the damage dealt.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                }
            },
            "origins:modify_damage_taken": {
                "damage_condition": damage_condition,
                "modifier": {
                    "name": "AA Modifier",
                    "type": "sub",
                    "desc": "If set, this modifier will apply to the damage taken.",
                    "data": aamodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attributed-Attribute-Modifier"
                },
                "modifiers": {
                    "name": "Modifiers",
                    "type": "list",
                    "desc": "If set, these modifiers will apply to the damage taken.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                }
            },
            "origins:modify_exhaustion": {
                "modifier": {
                    "name": "AA Modifier",
                    "type": "sub",
                    "desc": "If set, this modifier will apply to the exhaustion recieved.",
                    "data": aamodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attributed-Attribute-Modifier"
                },
                "modifiers": {
                    "name": "Modifiers",
                    "type": "list",
                    "desc": "If set, these modifiers will apply to the exhaustion recieved.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                }
            },
            "origins:modify_harvest": {
                "block_condition": block_condition,
                "allow": {
                    "name": "Allow",
                    "type": "checkbox",
                    "desc": "When true, the player will be able to harvest the blocks. When false, the player will not be able to harvest the blocks.",
                    "default": false
                }
            },
            "origins:modify_jump": {
                "modifier": {
                    "name": "AA Modifier",
                    "type": "sub",
                    "desc": "If set, this modifier will apply to the upwards jump velocity.",
                    "data": aamodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attributed-Attribute-Modifier"
                },
                "modifiers": {
                    "name": "Modifiers",
                    "type": "list",
                    "desc": "If set, these modifiers will apply to the upwards jump velocity.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                },
                "entity_action": entity_action
            },
            "origins:modify_swim_speed": {
                "modifier": {
                    "name": "AA Modifier",
                    "type": "sub",
                    "desc": "If set, this modifier will apply to the swim speed.",
                    "data": aamodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attributed-Attribute-Modifier"
                },
                "modifiers": {
                    "name": "Modifiers",
                    "type": "list",
                    "desc": "If set, these modifiers will apply to the swim speed.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                }
            },
            "origins:modify_lava_speed": {
                "modifier": {
                    "name": "AA Modifier",
                    "type": "sub",
                    "desc": "If set, this modifier will apply to the lava swim speed.",
                    "data": aamodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attributed-Attribute-Modifier"
                },
                "modifiers": {
                    "name": "Modifiers",
                    "type": "list",
                    "desc": "If set, these modifiers will apply to the lava swim speed.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                }
            },
            "origins:modify_player_spawn": {
                "dimension": {
                    "name": "Dimension",
                    "type": "ns",
                    "desc": "ID of the dimension the player should spawn in. Vanilla dimensions are minecraft:overworld, minecraft:the_nether and minecraft:the_end, but IDs of custom/modded dimensions should also work."
                },
                "structure": {
                    "name": "Structure",
                    "type": "ns",
                    "desc": "ID of the structure the player should spawn in. Keep in mind that the structure needs to generate in the specified dimension!"
                }
            },
            "origins:night_vision": {
                "strength": {
                    "name": "Strength",
                    "type": "double",
                    "desc": "How strong the night vision effect is. Range: 0 - 1.",
                    "default": 1.0
                }
            },
            "origins:particle": {
                "particle": {
                    "name": "Particle",
                    "type": "ns",
                    "desc": "ID of the particle type to use."
                },
                "frequency": {
                    "name": "Frequency",
                    "type": "int",
                    "desc": "How often the particles should spawn (interval in ticks).",
                    "default": 5
                }
            },
            "origins:phasing": {
                "block_condition": block_condition,
                "blacklist": {
                    "name": "Blacklist",
                    "type": "checkbox",
                    "desc": "If set to true, the block_condition will define which blocks the player can NOT move through."
                },
                "render_type": {
                    "name": "Render Type",
                    "type": "options",
                    "desc": "Defines how the phasing will look when inside a block.",
                    "options": ["remove_blocks", "blindness"]
                },
                "view_distance": {
                    "name": "View Distance",
                    "type": "double",
                    "desc": 'How far the player can look through walls while phasing with the "blindness" render_type.',
                    "default": 10.0
                },
                "phase_down_condition": {
                    "name": "Phase Down Condition",
                    "type": "sub",
                    "desc": "When specified, this condition needs to be fulfilled in order for blocks below the player to become phasable. Defaults to a condition which checks for sneaking.",
                    "data": condition_data
                }
            },
            "origins:prevent_item_use": {
                "item_condition": {
                    "name": "Blocked Item",
                    "type": "sub",
                    "desc": "If set, only items which satisfy this condition will be blocked.",
                    "data": item_condition_data
                }
            },
            "origins:prevent_sleep": {
                "block_condition": {
                    "name": "Bed Block Condition",
                    "type": "sub",
                    "desc": "If set, sleep will only be prevented if this condition holds for the bed.",
                    "data": block_condition_data
                },
                "message": {
                    "name": "Message",
                    "type": "text",
                    "desc": "The message that will be shown when sleep is prevented this way.",
                    "default": "origins.cant_sleep"
                }
            },
            "origins:restrict_armor": {
                "head": {
                    "name": "Head Item Condition",
                    "type": "sub",
                    "desc": "If set, items which satisfy this condition can not be equipped in the head slot.",
                    "data": item_condition_data,
                    "hidden": true
                },
                "chest": {
                    "name": "Chest Item Condition",
                    "type": "sub",
                    "desc": "If set, items which satisfy this condition can not be equipped in the chest slot.",
                    "data": item_condition_data,
                    "hidden": true
                },
                "legs": {
                    "name": "Legs Item Condition",
                    "type": "sub",
                    "desc": "If set, items which satisfy this condition can not be equipped in the legs slot.",
                    "data": item_condition_data,
                    "hidden": true
                },
                "feet": {
                    "name": "Feet Item Condition",
                    "type": "sub",
                    "desc": "If set, items which satisfy this condition can not be equipped in the feet slot.",
                    "data": item_condition_data,
                    "hidden": true
                }
            },
            "origins:conditioned_restrict_armor": {
                "tick_rate": tick_rate,
                "head": {
                    "name": "Head Item Condition",
                    "type": "sub",
                    "desc": "If set, items which satisfy this condition can not be equipped in the head slot.",
                    "data": item_condition_data,
                    "hidden": true
                },
                "chest": {
                    "name": "Chest Item Condition",
                    "type": "sub",
                    "desc": "If set, items which satisfy this condition can not be equipped in the chest slot.",
                    "data": item_condition_data,
                    "hidden": true
                },
                "legs": {
                    "name": "Legs Item Condition",
                    "type": "sub",
                    "desc": "If set, items which satisfy this condition can not be equipped in the legs slot.",
                    "data": item_condition_data,
                    "hidden": true
                },
                "feet": {
                    "name": "Feet Item Condition",
                    "type": "sub",
                    "desc": "If set, items which satisfy this condition can not be equipped in the feet slot.",
                    "data": item_condition_data,
                    "hidden": true
                }
            },
            "origins:stacking_status_effect": {
                "min_stacks": {
                    "name": "Min Stacks",
                    "type": "int",
                    "desc": "The minimum number of stacks. Negative numbers are allowed."
                },
                "max_stacks": {
                    "name": "Min Stacks",
                    "type": "int",
                    "desc": "The maximum number of stacks."
                },
                "duration_per_stack": {
                    "name": "Duration Per Stack",
                    "type": "int",
                    "desc": "When the status effects are applied, their duration will be stacks * duration_per_stack in ticks."
                },
                "effect": status_effect,
                "effects": status_effects
            },
            "origins:toggle_night_vision": {
                "active_by_default": {
                    "name": "Active by Default",
                    "type": "checkbox",
                    "desc": "Whether this power starts in the on or off state.",
                    "default": true
                },
                "strength": {
                    "name": "Strength",
                    "type": "double",
                    "desc": "How strong the night vision effect is. Range: 0 - 1.",
                    "default": 1.0
                },
                "key": key_form
            },
            "origins:damage_over_time": {
                "interval": {
                    "name": "Interval",
                    "type": "int",
                    "desc": "Duration of ticks to wait between the damage is applied.",
                    "default": 40
                },
                "onset_delay": {
                    "name": "Onset Delay",
                    "type": "int",
                    "desc": 'How many ticks the power has to be active in order to apply the first damage. Defaults to "Interval"'
                },
                "damage": {
                    "name": "Damage",
                    "type": "double",
                    "desc": "How much damage will be dealt each interval.",
                    "default": 2.0
                },
                "damage_easy": {
                    "name": "Damage Easy",
                    "type": "double",
                    "desc": 'How much damage will be dealt each interval on Easy difficulty. Defaults to "Damage"'
                },
                "damage_source": damage_source,
                "protection_enchantment": {
                    "name": "Protection Enchantment",
                    "type": "ns",
                    "desc": "If set, the total amount of levels of this enchantment will be counted on the player's armor to increase the onset_delay."
                },
                "protection_effectiveness": {
                    "name": "Protection Effectiveness",
                    "type": "double",
                    "desc": "If protection_enchantment is set, this multiplier scales how effective it will be (1.0 = time the onset_delay is increased is the same as with Hydrophobia and Water Protection).",
                    "default": 1.0
                }
            },
            "origins:swimming": {},
            "origins:fire_immunity": {},
            "origins:lava_vision": {
                "s": {
                    "name": "Near View?",
                    "type": "double",
                    "desc": "Vanilla default is 0.25, or 0.0 if you are under the effect of Fire Resistance.",
                    "default": 0.0
                },
                "v": {
                    "name": "Far View?",
                    "type": "double",
                    "desc": "Vanilla default is 1.0, or 3.0 if you are under the effect of Fire Resistance.",
                    "default": 3.0
                }
            },
            "origins:active_self": {
                "entity_action": entity_action,
                "cooldown": cooldown,
                "hud_render": hud_render,
                "key": key_form
            },
            "origins:action_over_time": {
                "entity_action": entity_action,
                "interval": {
                    "name": "Interval",
                    "type": "int",
                    "desc": "Interval of ticks between subsequent executions of the action."
                },
                "rising_action": {
                    "name": "Rising Action",
                    "type": "sub",
                    "desc": "The action to execute on the first interval tick in which the condition became true.",
                    "data": entity_action_data
                },
                "falling_action": {
                    "name": "Falling Action",
                    "type": "sub",
                    "desc": "The action to execute on the first interval tick in which the condition became false.",
                    "data": entity_action_data
                }
            },
            "origins:self_action_when_hit": {
                "entity_action": entity_action,
                "damage_condition": damage_condition,
                "cooldown": cooldown,
                "hud_render": hud_render
            },
            "origins:attacker_action_when_hit": {
                "entity_action": entity_action,
                "damage_condition": damage_condition,
                "cooldown": cooldown,
                "hud_render": hud_render
            },
            "origins:self_action_on_hit": {
                "entity_action": entity_action,
                "damage_condition": damage_condition,
                "cooldown": cooldown,
                "hud_render": hud_render,
                "target_condition": {
                    "name": "Target Condition",
                    "type": "sub",
                    "desc": "If set, the action will only be triggered when a target matching this condition is hit.",
                    "data": condition_data
                }
            },
            "origins:target_action_on_hit": {
                "entity_action": entity_action,
                "damage_condition": damage_condition,
                "cooldown": cooldown,
                "hud_render": hud_render,
                "target_condition": {
                    "name": "Target Condition",
                    "type": "sub",
                    "desc": "If set, the action will only be triggered when a target matching this condition is hit.",
                    "data": condition_data
                }
            },
            "origins:self_action_on_kill": {
                "entity_action": entity_action,
                "damage_condition": damage_condition,
                "cooldown": cooldown,
                "hud_render": hud_render,
                "target_condition": {
                    "name": "Target Condition",
                    "type": "sub",
                    "desc": "If set, the action will only be triggered when a target matching this condition is killed.",
                    "data": condition_data
                }
            },
            "origins:action_on_callback": {
                "entity_action_chosen": {
                    "name": "Chosen Action",
                    "type": "sub",
                    "desc": "If set, this action will be executed on the player when the power is gained.",
                    "data": entity_action_data
                },
                "execute_chosen_when_orb": {
                    "name": "Chosen When Orb",
                    "type": "checkbox",
                    "desc": "When this is false, the entity_action_chosen will not be executed when the player changes their origin with an orb, but only when the player chooses an origin for the first time or their origin was reset to origins:empty via a command.",
                    "default": true
                },
                "entity_action_respawned": {
                    "name": "Respawn Action",
                    "type": "sub",
                    "desc": "If set, this action will be executed on the player right after the player respawns.",
                    "data": entity_action_data
                },
                "entity_action_removed": {
                    "name": "Removed Action",
                    "type": "sub",
                    "desc": "If set, this action will be executed on the player when the power is removed.",
                    "data": entity_action_data
                },
                "entity_action_added": {
                    "name": "Added Action",
                    "type": "sub",
                    "desc": "If set, this action will be executed on the player when the power is added.",
                    "data": entity_action_data
                },
                "entity_action_lost": {
                    "name": "Lost Action",
                    "type": "sub",
                    "desc": "If set, this action will be executed on the player when the power is lost.",
                    "data": entity_action_data
                }
            },
            "origins:action_on_block_break": {
                "entity_action": entity_action,
                "block_action": block_action,
                "block_condition": block_condition,
                "only_when_harvested": {
                    "name": "Harvest Only",
                    "type": "checkbox",
                    "desc": "If this is true, the actions will only execute when the player succeeds in harvesting the block (e.g. they will not trigger when stone is broken by hand).",
                    "default": true
                }
            },
            "origins:action_on_land": {
                "entity_action": entity_action
            },
            "origins:starting_equipment": {
                "stack": {
                    "name": "Stack",
                    "type": "sub",
                    "desc": "If set, this item stack will be given to the player, optionally into the specified inventory slot.",
                    "data": positioned_item_stack
                },
                "stacks": {
                    "name": "Stacks",
                    "type": "list",
                    "desc": "If set, these item stacks will be given to the player, optionally into the specified inventory slots.",
                    "data": positioned_item_stack
                },
                "recurrent": {
                    "name": "Recurrent",
                    "type": "checkbox",
                    "desc": "When set to true, the starting equipment will always be given to the player after they died, otherwise only once when the power is gained."
                }
            },
            "origins:walk_on_fluid": {
                "fluid": {
                    "name": "Fluid",
                    "type": "ns",
                    "desc": "ID of the fluid tag on which the player should be able to walk. Most important examples: minecraft:water and minecraft:lava."
                }
            },
            "origins:shader": {
                "shader": {
                    "name": "Shader",
                    "type": "ns",
                    "desc": "Specifies the location of the shader resource file to use. For more information about shaders, look at the wiki and Minecraft Wiki: Shaders."
                }
            },
            "origins:shaking": {},
            "origins:resource": {
                "min": {
                    "name": "Min Value",
                    "type": "int",
                    "desc": "The minimum value of the resource."
                },
                "max": {
                    "name": "Max Value",
                    "type": "int",
                    "desc": "The maximum value of the resource."
                },
                "start_value": {
                    "name": "Start Value",
                    "type": "int",
                    "desc": "The value of the resource when the player first chooses an origin with this power. Defaults to 'min'"
                },
                "hud_render": hud_render
            },
            "origins:modify_food": {
                "item_condition": {
                    "name": "Item Condition",
                    "type": "sub",
                    "desc": "If set, the modifiers will only apply to food items which satisfy this condition.",
                    "data": item_condition_data
                },
                "food_modifier": {
                    "name": "Food Modifier",
                    "type": "sub",
                    "desc": "If set, this modifier will apply to the food amount gained by eating.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                },
                "food_modifiers": {
                    "name": "Food Modifiers",
                    "type": "list",
                    "desc": "If set, these modifiers will apply to the food amount gained by eating.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                },
                "saturation_modifier": {
                    "name": "Saturation Modifier",
                    "type": "sub",
                    "desc": "If set, this modifier will apply to the saturation gained by eating.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                },
                "saturation_modifiers": {
                    "name": "Saturation Modifiers",
                    "type": "list",
                    "desc": "If set, these modifiers will apply to the saturation gained by eating.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                },
                "entity_action": {
                    "name": "Eaten Action",
                    "type": "sub",
                    "desc": "If set, this action will be executed on the entity eating this item.",
                    "data": entity_action_data
                }
            },
            "origins:modify_xp_gain": {
                "modifiers": {
                    "name": "XP Modifier",
                    "type": "sub",
                    "desc": "If set, this modifier will apply to the experience gained.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                },
                "modifiers": {
                    "name": "XP Modifiers",
                    "type": "list",
                    "desc": "If set, these modifiers will apply to the experience gained.",
                    "data": amodifier,
                    "link": "https://github.com/apace100/origins-fabric/wiki/Attribute-Modifier"
                }
            },
            "origins:disable_regen": {}, // I added this one :D
            "origins:prevent_entity_render": {
                "entity_condition": {
                    "name": "Entity Condition",
                    "type": "sub",
                    "desc": "If this condition on another entity is true, the entity will not be rendered for the player.",
                    "data": condition_data
                }
            },
            "origins:entity_glow": {
                "entity_condition": {
                    "name": "Entity Condition",
                    "type": "sub",
                    "desc": "If this condition on another entity is true, the entity will glow for the player.",
                    "data": condition_data
                }
            },
            "origins:climbing": {
                "allow_holding": {
                    "name": "Allow Holding",
                    "type": "checkbox",
                    "desc": "With this set to true, the player is able to hold onto what they are currently climbing by sneaking.",
                    "default": true
                }
            },
            "origins:prevent_block_selection": {
                "block_condition": block_condition
            },
            "origins:recipe": {
                "recipe": {
                    "name": "Recipe",
                    "type": "sub",
                    "desc": "The recipe to craft, including an id field which can be any arbitrary (but unique) identifier.",
                    "data": i_recipe_data
                }
            }
        }
    }
};
Object.assign(power_copy, power_data);
delete power_copy.info;

var forms = {
    "meta": {
        "icon": {
            "name": "Icon",
            "type": "image",
            "desc": "128x128 Icon to use in for your pack. It will appear in the mod or datapack. If you select an image of the wrong size, it will be resized automatically."
        },
        "name": {
            "name": "Name",
            "type": "main",
            "desc": "The display name of your pack. It will be used in the mod title or datapack name."
        },
        "id": {
            "name": "Mod ID",
            "type": "ns",
            "desc": "This is the default namespace of your datapack items and also the mod id to export to if using a mod."
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
        },
        "pack_format": {
            "name": "Pack Version",
            "type": "int",
            "desc": "When exporting to a datapack, this is the number that the pack.mcmeta file will use.",
            "default": 6
        }
    },
    "origin_layers": {
        "info": {
            "type": "info",
            "info": "<a href='https://github.com/apace100/origins-fabric/wiki/Defining-an-origin-in-JSON'>Wiki Format</a>"
        },
        "replace": {
            "name": "Replace",
            "type": "checkbox",
            "desc": "Whether or not to replace an already existing layer in another pack.",
            "default": false
        },
        "origins": {
            "name": "Origins",
            "type": "list",
            "desc": "IDs of origins to include in this layer.",
            "data": {
                "": {
                    "type": "multi",
                    "options": ["simple", "extra"],
                    "types": ["ns", "sub"],
                    "data": {
                        1: {
                            "condition": {
                                "name": "Condition",
                                "type": "sub",
                                "desc": "Condition that needs to hold in order for the origins in the list to be active.",
                                "data": condition_data
                            },
                            "origins": {
                                "name": "Origins",
                                "type": "list",
                                "desc": "IDs of origins to include in this layer conditionally.",
                                "data": {
                                    "": {
                                        "type": "ns"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "origins": {
        "info": {
            "type": "info",
            "info": "<a href='https://github.com/apace100/origins-fabric/wiki/Defining-an-origin-in-JSON'>Wiki Format</a>"
        },
        "name": {
            "name": "Name",
            "type": "text",
            "desc": "When defined, this is the translation key (or literal text) that will be used as the name of the origin, instead of the default generated one."
        },
        "description": {
            "name": "Description",
            "type": "textarea",
            "desc": "When defined, this is the translation key (or literal text) that will be used as the description of the origin, instead of the default generated one."
        },
        "icon": {
            "name": "Icon Item",
            "type": "ns",
            "desc": "The item ID of the item to use as the icon for this origin in the origin screen."
        },
        "impact": {
            "name": "Impact",
            "type": "int",
            "desc": "The impact value of the origin, where 0 = none, 1 = low, 2 = medium, 3 = high.",
            "default": 2
        },
        "order": {
            "name": "Order",
            "type": "int",
            "desc": "In the origin screen, origins are sorted first by impact, and second by this order value, where lower values come first.",
            "default": 0
        },
        "powers": {
            "name": "Powers",
            "type": "textlist",
            "desc": "A list of powers which this origin should have, split by lines. Each line should have a valid power namespaced id."
        },
        "loading_priority": {
            "name": "Load Priority",
            "type": "int",
            "desc": "Origins with higher loading priority override origins registered under the same ID with a lower loading priority. Use a value greater than 0 if you want to override origins added by the mod itself.",
            "default": 0
        },
        "unchoosable": {
            "name": "Unchoosable",
            "type": "checkbox",
            "desc": "If this is set to true, the origin will not be shown in the origin selection screen and cannot be chosen."
        },
        "upgrades": {
            "name": "Upgrades",
            "type": "list",
            "desc": "Defines origins this origin will change into when an advancement is reached by the player.",
            "data": {
                "condition": {
                    "name": "Advancement",
                    "type": "text",
                    "desc": "Advancement condition on which to apply this upgrade."
                },
                "origin": {
                    "name": "Origin ID",
                    "type": "ns",
                    "desc": "Origin to upgrade to when the advancement has been met."
                },
                "announcement": {
                    "name": "Announcement",
                    "type": "textarea",
                    "desc": "Message sent to chat when a player acquires this upgrade.",
                    "size": true
                }
            }
        }
    },
    "powers": power_data,
    "tags": {
        "info": {
            "type": "info",
            "info": "<a href='https://minecraft.gamepedia.com/Tag'>Wiki Format</a>"
        },
        "replace": {
            "name": "Replace",
            "type": "checkbox",
            "desc": "Whether to replace an already existing loaded tag.",
            "default": false
        },
        "values": {
            "name": "Values",
            "type": "list",
            "desc": "A list of ids and other tags to include in this tag.",
            "data": {
                "": {
                    "type": "multi",
                    "options": ["simple", "extra"],
                    "types": ["ns", "sub"],
                    "data": {
                        1: {
                            "id": {
                                "name": "ID",
                                "type": "ns",
                                "desc": "An id or another tag"
                            },
                            "required": {
                                "name": "Required",
                                "type": "checkbox",
                                "desc": "Whether or not this thing is required.",
                                "default": true
                            }
                        }
                    }
                }
            }
        }
    },
    "predicates": extforms.predicates,
    "advancements": extforms.advancements,
    "recipes": extforms.recipes,
    "loot_tables": extforms.loot_tables,
    "__": inception
};