var status_effects_vanilla = {
    "name": "Effects",
    "type": "nlist",
    "desc": "A list of status effects, with the name of each item being the status effect name.",
    "data": {
        "ambient": {
            "name": "Ambient",
            "type": "bool",
            "desc": "Whether the effect is from a beacon."
        },
        "amplifier": {
            "name": "Amplifier",
            "type": "multi",
            "desc": "The effect amplifier.",
            "panel": true,
            "options": ["simple", "extra"],
            "types": ["int", "sub"],
            "data": {
                1: {
                    "min": {
                        "name": "Min",
                        "type": "int",
                        "desc": "The minimum value."
                    },
                    "max": {
                        "name": "Max",
                        "type": "int",
                        "desc": "The maximum value."
                    }
                }
            }
        },
        "duration": {
            "name": "Duration",
            "type": "multi",
            "desc": "The effect duration.",
            "panel": true,
            "options": ["simple", "extra"],
            "types": ["int", "sub"],
            "data": {
                1: {
                    "min": {
                        "name": "Min",
                        "type": "int",
                        "desc": "The minimum value."
                    },
                    "max": {
                        "name": "Max",
                        "type": "int",
                        "desc": "The maximum value."
                    }
                }
            }
        },
        "visible": {
            "name": "Visible",
            "type": "bool",
            "desc": "Whether the effect has visible particles."
        }
    }
};

var item_tags_data = {
    "item": {
        "name": "Item",
        "type": "ns",
        "desc": "The ID of this item."
    },
    "tag": {
        "name": "Tag",
        "type": "ns",
        "desc": "A tag to check this item is in. Item does not need to be specified."
    },
    "nbt": {
        "name": "NBT",
        "type": "textarea",
        "desc": "An NBT string to check this item has."
    },
    "potion": {
        "name": "Potion",
        "type": "ns",
        "desc": "A brewed potion ID."
    },
    "count": {
        "name": "Count",
        "type": "multi",
        "desc": "Amount of the item.",
        "panel": true,
        "options": ["simple", "extra"],
        "types": ["int", "sub"],
        "data": {
            1: {
                "min": {
                    "name": "Min",
                    "type": "int",
                    "desc": "The minimum value."
                },
                "max": {
                    "name": "Max",
                    "type": "int",
                    "desc": "The maximum value."
                }
            }
        }
    },
    "durability": {
        "name": "Durability",
        "type": "multi",
        "desc": "The durability of the item.",
        "panel": true,
        "options": ["simple", "extra"],
        "types": ["int", "sub"],
        "data": {
            1: {
                "min": {
                    "name": "Min",
                    "type": "int",
                    "desc": "The minimum value."
                },
                "max": {
                    "name": "Max",
                    "type": "int",
                    "desc": "The maximum value."
                }
            }
        }
    },
    "enchantments": {
        "name": "Enchantments",
        "type": "list",
        "desc": "List of enchantments",
        "data": {
            "enchantment": {
                "name": "Enchantment",
                "type": "ns",
                "desc": "ID of an enchantment to match."
            },
            "levels": {
                "name": "Level",
                "type": "multi",
                "desc": "The level of the enchantment.",
                "panel": true,
                "options": ["simple", "extra"],
                "types": ["int", "sub"],
                "data": {
                    1: {
                        "min": {
                            "name": "Min",
                            "type": "int",
                            "desc": "The minimum value."
                        },
                        "max": {
                            "name": "Max",
                            "type": "int",
                            "desc": "The maximum value."
                        }
                    }
                }
            }
        }
    },
    "stored_enchantments": {
        "name": "Stored Enchantments",
        "type": "list",
        "desc": "List of stored enchantments",
        "data": {
            "enchantment": {
                "name": "Enchantment",
                "type": "ns",
                "desc": "ID of an enchantment to match."
            },
            "levels": {
                "name": "Level",
                "type": "multi",
                "desc": "The level of the enchantment.",
                "panel": true,
                "options": ["simple", "extra"],
                "types": ["int", "sub"],
                "data": {
                    1: {
                        "min": {
                            "name": "Min",
                            "type": "int",
                            "desc": "The minimum value."
                        },
                        "max": {
                            "name": "Max",
                            "type": "int",
                            "desc": "The maximum value."
                        }
                    }
                }
            }
        }
    }
};
var location_tags_data = {
    "biome": {
        "name": "Biome",
        "type": "ns",
        "desc": "The biome located at the location. Accepts modded biomes; click to see vanilla biome IDs.",
        "link": "https://minecraft.gamepedia.com/Biome#Biome_IDs"
    },
    "block": {
        "name": "Block",
        "type": "sub",
        "desc": "The block at the location.",
        "data": {
            "block": {
                "name": "Block ID",
                "type": "ns",
                "desc": "The block ID, like minecraft:gold_block or minecraft:diamond_ore."
            },
            "tag": {
                "name": "Block Tag",
                "type": "ns",
                "desc": "A block tag to check this block is in. It can work without Block ID."
            },
            "nbt": {
                "name": "NBT",
                "type": "textarea",
                "desc": "The block NBT to match for."
            },
            "state": {
                "name": "State",
                "type": "nlist",
                "desc": "A map of block property names to values. Test will fail if the block doesn't match.",
                "data": {
                    "": {
                        "type": "text"
                    }
                }
            }
        }
    },
    "dimension": {
        "name": "Dimension",
        "type": "ns",
        "desc": "The dimension of this location."
    },
    "feature": {
        "name": "Feature",
        "type": "ns",
        "desc": "A world structure like the mansion or stronghold."
    },
    "fluid": {
        "name": "Fluid",
        "type": "sub",
        "desc": "The fluid at this location.",
        "data": {
            "fluid": {
                "name": "Fluid ID",
                "type": "ns",
                "desc": "The fluid ID, like minecraft:water or minecraft:lava."
            },
            "tag": {
                "name": "Fluid Tag",
                "type": "ns",
                "desc": "A fluid tag to check this fluid is in. It can work without Fluid ID."
            },
            "state": {
                "name": "State",
                "type": "nlist",
                "desc": "A map of fluid property names to values. Test will fail if the fluid doesn't match.",
                "data": {
                    "": {
                        "type": "text"
                    }
                }
            }
        }
    },
    "light": {
        "name": "Light",
        "type": "multi",
        "desc": "The light level at this location.",
        "panel": true,
        "options": ["simple", "extra"],
        "types": ["int", "sub"],
        "data": {
            1: {
                "min": {
                    "name": "Min",
                    "type": "int",
                    "desc": "The minimum value."
                },
                "max": {
                    "name": "Max",
                    "type": "int",
                    "desc": "The maximum value."
                }
            }
        }
    },
    "position": {
        "name": "Position",
        "type": "sub",
        "data": {
            "x": {
                "name": "X",
                "type": "multi",
                "panel": true,
                "options": ["simple", "extra"],
                "types": ["double", "sub"],
                "data": {
                    1: {
                        "min": {
                            "name": "Min",
                            "type": "double",
                            "desc": "The minimum value."
                        },
                        "max": {
                            "name": "Max",
                            "type": "double",
                            "desc": "The maximum value."
                        }
                    }
                }
            },
            "y": {
                "name": "Y",
                "type": "multi",
                "panel": true,
                "options": ["simple", "extra"],
                "types": ["double", "sub"],
                "data": {
                    1: {
                        "min": {
                            "name": "Min",
                            "type": "double",
                            "desc": "The minimum value."
                        },
                        "max": {
                            "name": "Max",
                            "type": "double",
                            "desc": "The maximum value."
                        }
                    }
                }
            },
            "z": {
                "name": "Z",
                "type": "multi",
                "panel": true,
                "options": ["simple", "extra"],
                "types": ["double", "sub"],
                "data": {
                    1: {
                        "min": {
                            "name": "Min",
                            "type": "double",
                            "desc": "The minimum value."
                        },
                        "max": {
                            "name": "Max",
                            "type": "double",
                            "desc": "The maximum value."
                        }
                    }
                }
            }
        }
    },
    "smokey": {
        "name": "Smokey",
        "type": "bool",
        "desc": "True if the block is closely above a campfire or soul campfire."
    }
};
var entity_tags_copy = {};
var entity_tags_data = {
    "distance": {
        "name": "Distance",
        "type": "sub",
        "data": {
            "absolute": {
                "name": "Absolute",
                "type": "sub",
                "data": {
                    "min": {
                        "name": "Min",
                        "type": "double",
                        "desc": "The minimum value."
                    },
                    "max": {
                        "name": "Max",
                        "type": "double",
                        "desc": "The maximum value."
                    }
                }
            },
            "horizontal": {
                "name": "Horizontal",
                "type": "sub",
                "data": {
                    "min": {
                        "name": "Min",
                        "type": "double",
                        "desc": "The minimum value."
                    },
                    "max": {
                        "name": "Max",
                        "type": "double",
                        "desc": "The maximum value."
                    }
                }
            },
            "x": {
                "name": "X",
                "type": "sub",
                "data": {
                    "min": {
                        "name": "Min",
                        "type": "double",
                        "desc": "The minimum value."
                    },
                    "max": {
                        "name": "Max",
                        "type": "double",
                        "desc": "The maximum value."
                    }
                }
            },
            "y": {
                "name": "Y",
                "type": "sub",
                "data": {
                    "min": {
                        "name": "Min",
                        "type": "double",
                        "desc": "The minimum value."
                    },
                    "max": {
                        "name": "Max",
                        "type": "double",
                        "desc": "The maximum value."
                    }
                }
            },
            "z": {
                "name": "Z",
                "type": "sub",
                "data": {
                    "min": {
                        "name": "Min",
                        "type": "double",
                        "desc": "The minimum value."
                    },
                    "max": {
                        "name": "Max",
                        "type": "double",
                        "desc": "The maximum value."
                    }
                }
            }
        }
    },
    "effects": status_effects_vanilla,
    "equipment": {
        "name": "Equipment",
        "type": "sub",
        "desc": "Equipment that this entity has.",
        "data": {
            "mainhand": {
                "name": "Mainhand",
                "type": "sub",
                "desc": "Item equiped in the player's main hand.",
                "data": item_tags_data
            },
            "offhand": {
                "name": "Offhand",
                "type": "sub",
                "desc": "Item equiped in the player's off hand.",
                "data": item_tags_data
            },
            "head": {
                "name": "Head",
                "type": "sub",
                "desc": "Item equiped on the player's head.",
                "data": item_tags_data
            },
            "chest": {
                "name": "Chest",
                "type": "sub",
                "desc": "Item equiped on the player's chest.",
                "data": item_tags_data
            },
            "legs": {
                "name": "Legs",
                "type": "sub",
                "desc": "Item equiped on the player's legs.",
                "data": item_tags_data
            },
            "feet": {
                "name": "Feet",
                "type": "sub",
                "desc": "Item equiped on the player's feet.",
                "data": item_tags_data
            }
        }
    },
    "flags": {
        "name": "Flags",
        "type": "sub",
        "desc": "Predicate Flags to be checked.",
        "data": {
            "is_on_fire": {
                "name": "On Fire",
                "type": "bool",
                "desc": "Test whether the entity is or is not on fire."
            },
            "is_sneaking": {
                "name": "Sneaking",
                "type": "bool",
                "desc": "Test whether the entity is or is not sneaking."
            },
            "is_sprinting": {
                "name": "Sprinting",
                "type": "bool",
                "desc": "Test whether the entity is or is not sprinting."
            },
            "is_swimming": {
                "name": "Swimming",
                "type": "bool",
                "desc": "Test whether the entity is or is not swimming."
            },
            "is_baby": {
                "name": "Baby",
                "type": "bool",
                "desc": "Test whether the entity is or is not a baby variant."
            }
        }
    },
    "location": {
        "name": "Location",
        "type": "sub",
        "data": location_tags_data
    },
    "nbt": {
        "name": "NBT",
        "type": "textarea",
        "data": "NBT to check if this entity has."
    },
    "player": {
        "name": "Player",
        "type": "sub",
        "desc": "Player properties to be checked. Fails when entity is not a player.",
        "data": {
            "advancements": {
                "name": "Advancements",
                "type": "ace",
                "desc": "A map of advancements to check."
            },
            "gamemode": {
                "name": "Gamemode",
                "type": "options",
                "desc": "The game mode of the player.",
                "options": ["survival", "adventure", "creative", "spectator"]
            },
            "level": {
                "name": "Level",
                "type": "multi",
                "desc": "The experience level of the player.",
                "panel": true,
                "options": ["simple", "extra"],
                "types": ["int", "sub"],
                "data": {
                    1: {
                        "min": {
                            "name": "Min",
                            "type": "int",
                            "desc": "The minimum value."
                        },
                        "max": {
                            "name": "Max",
                            "type": "int",
                            "desc": "The maximum value."
                        }
                    }
                }
            },
            "recipes": {
                "name": "Recipes",
                "type": "ace",
                "desc": "A map of recipes to check."
            },
            "stats": {
                "name": "Stats",
                "type": "list",
                "desc": "A list of statistics to match.",
                "data": {
                    "type": {
                        "name": "Type",
                        "type": "text",
                        "desc": "The statistic base. Possible vanilla values are minecraft:custom, minecraft:crafted, minecraft:used, minecraft:broken, minecraft:mined, minecraft:killed, minecraft:picked_up, minecraft:dropped and minecraft:killed_by.",
                    },
                    "stat": {
                        "name": "Stat",
                        "type": "text",
                        "desc": "The statistic ID. Mostly mimics the criteria used for defining scoreboard objectives."
                    },
                    "value": {
                        "name": "Value",
                        "type": "multi",
                        "desc": "The value of the statistic.",
                        "panel": true,
                        "options": ["simple", "extra"],
                        "types": ["double", "sub"],
                        "data": {
                            1: {
                                "min": {
                                    "name": "Min",
                                    "type": "double",
                                    "desc": "The minimum value."
                                },
                                "max": {
                                    "name": "Max",
                                    "type": "double",
                                    "desc": "The maximum value."
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "team": {
        "name": "Team",
        "type": "text",
        "desc": "The team the entity belongs to."
    },
    "type": {
        "name": "Entity",
        "type": "ns",
        "desc": "An entity ID like minecraft:creeper or minecraft:zombie."
    },
    "targeted_entity": {
        "name": "Targeted Entity",
        "type": "sub",
        "desc": "The entity which this entity is targeting for attacks.",
        "data": entity_tags_copy
    },
    "vehicle": {
        "name": "Vehicle",
        "type": "sub",
        "desc": "The entity vehicle that the entity is riding on.",
        "data": entity_tags_copy
    }
};
Object.assign(entity_tags_copy, entity_tags_data);

var number_provider_data = {};
var min_number_provider = {};
var max_number_provider = {};
var trial_number_provider = {};
var prob_number_provider = {};
var rolls_number_provider = {};
var bonus_number_provider = {};
var levels_number_provider = {};
var limit_number_provider = {};
var count_number_provider = {};
var amount_number_provider = {};
var damage_number_provider = {};
var duration_number_provider = {};

var number_provider = {
    "name": "Value",
    "type": "multi",
    "panel": true,
    "hide": true, // Mojang implicity said this was necessary
    "desc": "A number provider value.",
    "options": ["simple", "extra"],
    "types": ["double", "sub"],
    "data": {
        1: number_provider_data
    }
};
number_provider_data.type = {
    "name": "Type",
    "type": "options",
    "desc": "The number provider type.",
    "more": "__type_options",
};
number_provider_data.__type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "minecraft:constant": {
            "value": {
                "name": "Value",
                "type": "double",
                "desc": "A value. Nothing much to say."
            }
        },
        "minecraft:uniform": {
            "min": min_number_provider,
            "max": max_number_provider
        },
        "minecraft:binomial": {
            "n": trial_number_provider,
            "p": prob_number_provider
        },
        "minecraft:score": {
            "target": {
                "name": "Target",
                "type": "multi",
                "desc": 'The range which Value must be in order to pass the check. If simple, it can be one of "this", "killer", "direct_killer", "player_killer"',
                "panel": true,
                "options": ["simple", "extra"],
                "types": ["text", "sub"],
                "data": {
                    1: {
                        "type": {
                            "name": "Type",
                            "type": "options",
                            "desc": 'Resource location. Either fixed or context.',
                            "more": "__type_options"
                        },
                        "__type_options": {
                            "type": "more",
                            "parent": "type",
                            "data": {
                                "fixed": {
                                    "name": {
                                        "name": "Name",
                                        "type": "text",
                                        "desc": "A UUID or playername."
                                    }
                                },
                                "context": {
                                    "target": {
                                        "name": "Target",
                                        "type": "text",
                                        "desc": "Scoreboard name provider. One of this, killer, direct_killer, player_killer."
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "score": {
                "name": "Objective",
                "type": "text",
                "desc": "The scoreboard objective."
            },
            "scale": {
                "name": "Scale",
                "type": "double",
                "desc": "Optional. Scale to multiply the score before returning it."
            }
        }
    }
};

Object.assign(min_number_provider, number_provider);
min_number_provider.name = "Min";
min_number_provider.desc = "The minimum value, as a number provider.";

Object.assign(max_number_provider, number_provider);
max_number_provider.name = "Max";
max_number_provider.desc = "The maximum value, as a number provider.";

Object.assign(trial_number_provider, number_provider);
trial_number_provider.name = "Trials";
trial_number_provider.desc = "The number of trials in this distribution.";

Object.assign(prob_number_provider, number_provider);
prob_number_provider.name = "Success Rate";
prob_number_provider.desc = "The probability of success on an individual trial.";

Object.assign(rolls_number_provider, number_provider);
rolls_number_provider.name = "Rolls";
rolls_number_provider.desc = "Specifies the number of rolls on the pool.";

Object.assign(bonus_number_provider, number_provider);
bonus_number_provider.name = "Bonus Rolls";
bonus_number_provider.desc = "Specifies the number of bonus rolls on the pool per point of luck. Rounded down after multiplying.";

Object.assign(levels_number_provider, number_provider);
levels_number_provider.name = "Levels";
levels_number_provider.desc = "Specifies the exact enchantment level to use.";

Object.assign(limit_number_provider, number_provider);
limit_number_provider.name = "Limit";
limit_number_provider.desc = "Limits the count.";

Object.assign(count_number_provider, number_provider);
count_number_provider.name = "Count";
count_number_provider.desc = "Sets the count of the item, either exactly (with set_count) or per level (with looting_enchant).";

Object.assign(amount_number_provider, number_provider);
amount_number_provider.name = "Amount";
amount_number_provider.desc = "Specifies the amount of the modifier.";

Object.assign(damage_number_provider, number_provider);
damage_number_provider.name = "Damage";
damage_number_provider.desc = "Sets the damage value (durability) for the item.";

Object.assign(duration_number_provider, number_provider);
duration_number_provider.name = "Duration";
duration_number_provider.desc = "Sets the duration of this status effect.";

var damage_predicate = {
    "bypasses_armor": {
        "name": "Bypassed Armor",
        "type": "bool",
        "desc": "Checks if the damage bypassed the armor of the player (suffocation damage predominantly)."
    },
    "bypasses_invulnerability": {
        "name": "Bypassed Armor",
        "type": "bool",
        "desc": "Checks if the damage bypassed the invulnerability status of the player (void or /kill damage)."
    },
    "bypasses_magic": {
        "name": "Bypassed Magic",
        "type": "bool",
        "desc": "Checks if the damage was caused by starvation."
    },
    "is_explosion": {
        "name": "Is Explosion",
        "type": "bool",
        "desc": "Checks if the damage originated from an explosion."
    },
    "is_fire": {
        "name": "Is Fire",
        "type": "bool",
        "desc": "Checks if the damage originated from fire."
    },
    "is_magic": {
        "name": "Is Magic",
        "type": "bool",
        "desc": "Checks if the damage originated from fire."
    },
    "is_projectile": {
        "name": "Is Projectile",
        "type": "bool",
        "desc": "Checks if the damage originated from a projectile."
    },
    "is_lightning": {
        "name": "Is Lightning",
        "type": "bool",
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

var damage_predicate_super = {
    "name": "Damage",
    "type": "sub",
    "desc": "Checks the damage done.",
    "data": {
        "blocked": {
            "name": "Blocked",
            "type": "bool",
            "desc": "Checks if the damage was successfully blocked."
        },
        "source_entity": {
            "name": "Source Entity",
            "type": "sub",
            "desc": "Checks the entity that was the source of the damage (for example: The skeleton that shot the arrow).",
            "data": entity_tags_data
        },
        "dealt": {
            "name": "Dealt",
            "type": "multi",
            "desc": "Checks the amount of incoming damage before damage reduction.",
            "panel": true,
            "options": ["simple", "extra"],
            "types": ["double", "sub"],
            "data": {
                1: {
                    "min": {
                        "name": "Min",
                        "type": "double",
                        "desc": "The minimum value."
                    },
                    "max": {
                        "name": "Max",
                        "type": "double",
                        "desc": "The maximum value."
                    }
                }
            }
        },
        "taken": {
            "name": "Taken",
            "type": "multi",
            "desc": "Checks the amount of incoming damage after damage reduction.",
            "panel": true,
            "options": ["simple", "extra"],
            "types": ["double", "sub"],
            "data": {
                1: {
                    "min": {
                        "name": "Min",
                        "type": "double",
                        "desc": "The minimum value."
                    },
                    "max": {
                        "name": "Max",
                        "type": "double",
                        "desc": "The maximum value."
                    }
                }
            }
        },
        "type": {
            "name": "Type",
            "type": "sub",
            "desc": "Checks the type of damage done.",
            "data": damage_predicate
        }
    }
};

var predicate_data = {};
predicate_data.info = {
    "type": "info",
    "info": "<a href='https://minecraft.gamepedia.com/Predicate'>Wiki Format</a>"
};
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
                "type": "ace",
                "desc": "A map of block property names to values. All values are strings. The test fails if the block doesn't match."
            }
        },
        "minecraft:damage_source_properties": {
            "predicate": {
                "name": "Predicate",
                "type": "sub",
                "desc": "The type of damage as a predicate.",
                "data": damage_predicate
            }
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
                "type": "ace",
                "desc": "Scores to check. All specified scores must pass for the condition to pass."
            }
        },
        "minecraft:inverted": {
            "term": predicate_data
        },
        "minecraft:killed_by_player": {
            "inverse": {
                "name": "Invert",
                "type": "checkbox",
                "desc": "If true, the condition passes if killer_player is not available."
            }
        },
        "minecraft:location_check": {
            "offsetX": {
                "name": "X Offset",
                "type": "int",
                "desc": "Optional offsets to location's x-coordinate."
            },
            "offsetY": {
                "name": "Y Offset",
                "type": "int",
                "desc": "Optional offsets to location's y-coordinate."
            },
            "offsetZ": {
                "name": "Z Offset",
                "type": "int",
                "desc": "Optional offsets to location's z-coordinate."
            },
            "predicate": {
                "name": "Location",
                "type": "sub",
                "desc": "Predicate applied to location, uses same structure as advancements.",
                "data": location_tags_data
            }
        },
        "minecraft:match_tool": {
            "predicate": {
                "name": "Item",
                "type": "sub",
                "desc": "Predicate applied to item, uses same structure as advancements.",
                "data": item_tags_data
            }
        },
        "minecraft:random_chance": {
            "chance": {
                "name": "Chance",
                "type": "double",
                "desc": "Success rate as a number 0.0–1.0.",
            }
        },
        "minecraft:random_chance_with_looting": {
            "chance": {
                "name": "Chance",
                "type": "double",
                "desc": "Base success rate as a number 0.0–1.0.",
            },
            "looting_multiplier": {
                "name": "Looting Multiplier",
                "type": "double",
                "desc": "Looting adjustment to the base success rate. Formula is chance + (looting_level * looting_multiplier)."
            }
        },
        "minecraft:reference": {
            "name": {
                "name": "Predicate ID",
                "type": "ns",
                "desc": "The namespaced ID of the condition (predicate) referred to. A cyclic reference causes a parsing failure."
            }
        },
        "minecraft:survives_explosion": {},
        "minecraft:table_bonus": {
            "enchantment": {
                "name": "Enchantment ID",
                "type": "ns",
                "desc": "This predicate passes with probability picked from table, indexed by this id and the enchantment level."
            },
            "chances": {
                "name": "Chances",
                "type": "list",
                "desc": "List of probabilities for enchantment level, indexed from 0.",
                "data": {
                    "": {
                        "type": "int"
                    }
                }
            }
        },
        "minecraft:time_check": {
            "value": {
                "name": "Value",
                "type": "multi",
                "desc": "The time value in ticks.",
                "panel": true,
                "options": ["simple", "extra"],
                "types": ["int", "sub"],
                "data": {
                    1: {
                        "min": min_number_provider,
                        "max": max_number_provider
                    }
                }
            },
            "period": {
                "name": "Period",
                "type": "int",
                "desc": "If present, time gets modulo-divided by this value (for example, if set to 24000, value operates on a time period of daytime ticks just like /time query daytime)."
            }
        },
        "minecraft:weather_check": {
            "raining": {
                "name": "Raining",
                "type": "bool",
                "desc": "If true, the condition evaluates to true only if it's raining."
            },
            "thundering": {
                "name": "Thundering",
                "type": "bool",
                "desc": "If true, the condition evaluates to true only if it's thundering."
            }
        },
        "minecraft:value_check": {
            "value": number_provider,
            "range": {
                "name": "Range",
                "type": "sub",
                "desc": "The range that the value must be in to pass the check.",
                "data": {
                    "min": min_number_provider,
                    "max": max_number_provider
                }
            }
        },
        "minecraft:origin": {
            "origin": {
                "name": "Origin",
                "type": "ns",
                "desc": "The name of an origin the player must have in order for this predicate to pass."
            }
        },
        "minecraft:power": {
            "power": {
                "name": "Power",
                "type": "ns",
                "desc": "The name of a power the player must have in order for this predicate to pass."
            }
        }
    }
};

var advancement_data = {
    "info": {
        "type": "info",
        "info": "<a href='https://minecraft.gamepedia.com/Advancement/JSON_format'>Wiki Format</a>"
    },
    "display": {
        "name": "Display",
        "type": "sub",
        "desc": "The optional display data.",
        "data": {
            "icon": {
                "item": {
                    "name": "Item Icon",
                    "type": "ns",
                    "desc": "The item id to use as this advancement's icon."
                },
                "nbt": {
                    "name": "Icon NBT",
                    "type": "textarea",
                    "desc": "The nbt data of the item to use for this advancement."
                }
            },
            "title": {
                "name": "Title",
                "type": "ace",
                "desc": "The title for this advancement, specified as either text in quotes or a json text component. Click to see the wiki for the json text format",
                "link": "https://minecraft.gamepedia.com/Raw_JSON_text_format"
            },
            "frame": {
                "name": "Frame",
                "type": "options",
                "desc": "The optional type of frame for the icon. challenge for a tile with a more fancy spiked border as it is used for the kill all mobs advancement, goal for a tile with a rounded border as it is used for the full beacon advancement, task for a normal tile (default.)",
                "options": ["task", "goal", "challenge"]
            },
            "background": {
                "name": "Background",
                "type": "ns",
                "desc": "The optional directory for the background to use in this advancement tab (used only for the root advancement)."
            },
            "description": {
                "name": "Description",
                "type": "ace",
                "desc": "The description of the advancement, specified as either text in quotes or a json text component. Click to see the wiki for the json text format",
                "link": "https://minecraft.gamepedia.com/Raw_JSON_text_format"
            },
            "show_toast": {
                "name": "Show Toast",
                "type": "checkbox",
                "desc": "Whether or not to show the toast pop up after completing this advancement.",
                "default": true
            },
            "announce_to_chat": {
                "name": "Announce",
                "type": "checkbox",
                "desc": "Whether or not to announce in the chat when this advancement has been completed. Defaults to true.",
                "default": true
            },
            "hidden": {
                "name": "Hidden",
                "type": "checkbox",
                "desc": "Whether or not to hide this advancement and all its children from the advancement screen until this advancement have been completed. Has no effect on root advancements themselves, but still affects all their children. Defaults to false."
            }
        }
    },
    "parent": {
        "name": "Parent",
        "type": "ns",
        "desc": "The optional parent advancement directory of this advancement. If this field is absent, this advancement is a root advancement. Circular references cause a loading failure."
    },
    "criteria": {
        "name": "Criteria",
        "type": "nlist",
        "desc": "The required criteria that have to be met.",
        "data": {
            "trigger": {
                "name": "Trigger",
                "type": "options",
                "desc": "The trigger for this advancement; specifies what the game should check for the advancement.",
                "more": "__trigger_options"
            },
            "__trigger_options": {
                "type": "more",
                "parent": "trigger",
                "data": {
                    "minecraft:impossible": {},
                    "minecraft:tick": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:bee_nest_destroyed": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "block": {
                                    "name": "Block",
                                    "type": "ns",
                                    "desc": "The block that was destroyed. Accepts block IDs."
                                },
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": "The item used to break the block.",
                                    "data": item_tags_data
                                },
                                "num_bees_inside": {
                                    "name": "Bee Count",
                                    "type": "int",
                                    "desc": "The number of bees that were inside the bee nest/beehive before it was broken."
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:bred_animals": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "child": {
                                    "name": "Child",
                                    "type": "list",
                                    "desc": "The child that results from the breeding. May also be a list of predicates that must pass in order for the trigger to activate.",
                                    "data": entity_tags_data
                                },
                                "parent": {
                                    "name": "Parent",
                                    "type": "list",
                                    "desc": "The parent. May also be a list of predicates that must pass in order for the trigger to activate.",
                                    "data": entity_tags_data
                                },
                                "partner": {
                                    "name": "Partner",
                                    "type": "list",
                                    "desc": "The partner. (The entity the parent was bred with) May also be a list of predicates that must pass in order for the trigger to activate.",
                                    "data": entity_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:brewed_potion": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "potion": {
                                    "name": "Potion",
                                    "type": "ns",
                                    "desc": "A brewed potion ID. Click to see wiki.",
                                    "link": "https://minecraft.gamepedia.com/Potion#Item_data"
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:changed_dimension": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "from": {
                                    "name": "From",
                                    "type": "ns",
                                    "desc": "The dimension the entity traveled from."
                                },
                                "to": {
                                    "name": "From",
                                    "type": "ns",
                                    "desc": "The dimension the entity traveled to. Same accepted values as above."
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:channeled_lightning": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "victims": {
                                    "name": "Victims",
                                    "type": "list",
                                    "desc": "The victims hit by the lightning summoned by the Channeling enchantment. All entities in this list must be hit. The checks are applied to the victim hit by the enchanted trident.",
                                    "data": entity_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:construct_beacon": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "level": {
                                    "name": "Level",
                                    "type": "multi",
                                    "desc": "The tier of the updated beacon structure.",
                                    "panel": true,
                                    "options": ["simple", "extra"],
                                    "types": ["int", "sub"],
                                    "data": {
                                        1: {
                                            "min": {
                                                "name": "Min",
                                                "type": "int",
                                                "desc": "The minimum value."
                                            },
                                            "max": {
                                                "name": "Max",
                                                "type": "int",
                                                "desc": "The maximum value."
                                            }
                                        }
                                    }
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:consume_item": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": "The item that was consumed.",
                                    "data": item_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:cured_zombie_villager": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "villager": {
                                    "name": "Villager",
                                    "type": "list",
                                    "desc": 'The villager that is the result of the conversion. The "type" tag is redundant since it will always be "villager".',
                                    "data": entity_tags_data
                                },
                                "zombie": {
                                    "name": "Zombie",
                                    "type": "list",
                                    "desc": 'The zombie villager right before the conversion is complete (not when it is initiated). The "type" tag is redundant since it will always be "zombie_villager".',
                                    "data": entity_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:effects_changed": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "effects": {
                                    "name": "Effects",
                                    "type": "nlist",
                                    "desc": "A list of status effects the player has. The name of each item is the status effect name.",
                                    "data": {
                                        "amplifier": {
                                            "name": "Amplifier",
                                            "type": "multi",
                                            "desc": "The effect amplifier.",
                                            "panel": true,
                                            "options": ["simple", "extra"],
                                            "types": ["int", "sub"],
                                            "data": {
                                                1: {
                                                    "min": {
                                                        "name": "Min",
                                                        "type": "int",
                                                        "desc": "The minimum value."
                                                    },
                                                    "max": {
                                                        "name": "Max",
                                                        "type": "int",
                                                        "desc": "The maximum value."
                                                    }
                                                }
                                            }
                                        },
                                        "duration": {
                                            "name": "Duration",
                                            "type": "multi",
                                            "desc": "The effect duration in ticks.",
                                            "panel": true,
                                            "options": ["simple", "extra"],
                                            "types": ["int", "sub"],
                                            "data": {
                                                1: {
                                                    "min": {
                                                        "name": "Min",
                                                        "type": "int",
                                                        "desc": "The minimum value."
                                                    },
                                                    "max": {
                                                        "name": "Max",
                                                        "type": "int",
                                                        "desc": "The maximum value."
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:enchanted_item": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": "The item after it has been enchanted.",
                                    "data": item_tags_data
                                },
                                "levels": {
                                    "name": "Levels",
                                    "type": "multi",
                                    "desc": "The levels spent by the player on the enchantment.",
                                    "panel": true,
                                    "options": ["simple", "extra"],
                                    "types": ["int", "sub"],
                                    "data": {
                                        1: {
                                            "min": {
                                                "name": "Min",
                                                "type": "int",
                                                "desc": "The minimum value."
                                            },
                                            "max": {
                                                "name": "Max",
                                                "type": "int",
                                                "desc": "The maximum value."
                                            }
                                        }
                                    }
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:enter_block": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "block": {
                                    "name": "Block",
                                    "type": "ns",
                                    "desc": "The block that the player is standing in. Accepts block IDs."
                                },
                                "state": {
                                    "name": "State",
                                    "type": "nlist",
                                    "desc": "A map of block property names to values. Test will fail if the block doesn't match.",
                                    "data": {
                                        "": {
                                            "type": "text"
                                        }
                                    }
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:entity_hurt_player": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "damage": damage_predicate_super,
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:entity_killed_player": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "entity": {
                                    "name": "Entity",
                                    "type": "list",
                                    "desc": 'Checks the entity that was the source of the damage that killed the player (for example: The skeleton that shot the arrow).',
                                    "data": entity_tags_data
                                },
                                "killing_blow": {
                                    "name": "Killing Blow",
                                    "type": "sub",
                                    "desc": "Checks the type of damage that killed the player. Missing corresponding list of predicates for the direct entity.",
                                    "data": damage_predicate
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:filled_bucket": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "item": {
                                    "name": "Item",
                                    "type": "list",
                                    "desc": 'The item resulting from filling the bucket.',
                                    "data": item_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:fishing_rod_hooked": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "entity": {
                                    "name": "Entity",
                                    "type": "list",
                                    "desc": "The entity that was pulled.",
                                    "data": predicate_data
                                },
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": "The item that was caught.",
                                    "data": item_tags_data
                                },
                                "rod": {
                                    "name": "Rod",
                                    "type": "sub",
                                    "desc": "The fishing rod used.",
                                    "data": item_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:hero_of_the_village": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "location": {
                                    "name": "Location",
                                    "type": "list",
                                    "desc": "The location of the player.",
                                    "data": location_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:inventory_changed": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "items": {
                                    "name": "Items",
                                    "type": "list",
                                    "desc": "A list of items in the player's inventory. All items in the list must be in the player's inventory, but not all items in the player's inventory have to be in this list.",
                                    "data": item_tags_data
                                },
                                "slots": {
                                    "name": "Slots",
                                    "type": "sub",
                                    "desc": "Tests about the number of different kinds of slots in the user's inventory.",
                                    "data": {
                                        "empty": {
                                            "name": "Empty",
                                            "type": "multi",
                                            "desc": "The amount of slots empty in the inventory.",
                                            "panel": true,
                                            "options": ["simple", "extra"],
                                            "types": ["int", "sub"],
                                            "data": {
                                                1: {
                                                    "min": {
                                                        "name": "Min",
                                                        "type": "int",
                                                        "desc": "The minimum value."
                                                    },
                                                    "max": {
                                                        "name": "Max",
                                                        "type": "int",
                                                        "desc": "The maximum value."
                                                    }
                                                }
                                            }
                                        },
                                        "full": {
                                            "name": "Full",
                                            "type": "multi",
                                            "desc": "The amount of slots completely filled (stacksize) in the inventory.",
                                            "panel": true,
                                            "options": ["simple", "extra"],
                                            "types": ["int", "sub"],
                                            "data": {
                                                1: {
                                                    "min": {
                                                        "name": "Min",
                                                        "type": "int",
                                                        "desc": "The minimum value."
                                                    },
                                                    "max": {
                                                        "name": "Max",
                                                        "type": "int",
                                                        "desc": "The maximum value."
                                                    }
                                                }
                                            }
                                        },
                                        "occupied": {
                                            "name": "Occupied",
                                            "type": "multi",
                                            "desc": "The amount of slots occupied in the inventory.",
                                            "panel": true,
                                            "options": ["simple", "extra"],
                                            "types": ["int", "sub"],
                                            "data": {
                                                1: {
                                                    "min": {
                                                        "name": "Min",
                                                        "type": "int",
                                                        "desc": "The minimum value."
                                                    },
                                                    "max": {
                                                        "name": "Max",
                                                        "type": "int",
                                                        "desc": "The maximum value."
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:item_durability_changed": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "delta": {
                                    "name": "Delta",
                                    "type": "multi",
                                    "desc": "The change in durability (negative numbers are used to indicate a decrease in durability).",
                                    "panel": true,
                                    "options": ["simple", "extra"],
                                    "types": ["int", "sub"],
                                    "data": {
                                        1: {
                                            "min": {
                                                "name": "Min",
                                                "type": "int",
                                                "desc": "The minimum value."
                                            },
                                            "max": {
                                                "name": "Max",
                                                "type": "int",
                                                "desc": "The maximum value."
                                            }
                                        }
                                    }
                                },
                                "durability": {
                                    "name": "Durability",
                                    "type": "multi",
                                    "desc": "The remaining durability of the item.",
                                    "panel": true,
                                    "options": ["simple", "extra"],
                                    "types": ["int", "sub"],
                                    "data": {
                                        1: {
                                            "min": {
                                                "name": "Min",
                                                "type": "int",
                                                "desc": "The minimum value."
                                            },
                                            "max": {
                                                "name": "Max",
                                                "type": "int",
                                                "desc": "The maximum value."
                                            }
                                        }
                                    }
                                },
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": "The item before it was damaged, allows you to check the durability before the item was damaged.",
                                    "data": item_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:item_used_on_block": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "location": {
                                    "name": "Location",
                                    "type": "list",
                                    "desc": "The location at the center of the block the item was used on.",
                                    "data": location_tags_data
                                },
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": "The item used on the block.",
                                    "data": item_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:killed_by_crossbow": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "unique_entity_types": {
                                    "name": "Kill Count",
                                    "type": "multi",
                                    "desc": "The count of unique types of entities killed with a single shot.",
                                    "panel": true,
                                    "options": ["simple", "extra"],
                                    "types": ["int", "sub"],
                                    "data": {
                                        1: {
                                            "min": {
                                                "name": "Min",
                                                "type": "int",
                                                "desc": "The minimum value."
                                            },
                                            "max": {
                                                "name": "Max",
                                                "type": "int",
                                                "desc": "The maximum value."
                                            }
                                        }
                                    }
                                },
                                "victims": {
                                    "name": "Victims",
                                    "type": "ace",
                                    "desc": "A predicate for any of the killed entities or a list of predicates for any of the killed entities. All of the predicates must be matched, and one killed entity may match only one predicate. Refer to the wiki for more information, as this is complex."
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:levitation": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "distance": {
                                    "name": "Distance",
                                    "type": "sub",
                                    "desc": "I think this is the distance from the place where the player was originally given levitation to the place the player traveled to.",
                                    "data": {
                                        "absolute": {
                                            "name": "Absolute",
                                            "type": "sub",
                                            "data": {
                                                "min": {
                                                    "name": "Min",
                                                    "type": "int",
                                                    "desc": "The minimum value."
                                                },
                                                "max": {
                                                    "name": "Max",
                                                    "type": "int",
                                                    "desc": "The maximum value."
                                                }
                                            }
                                        },
                                        "horizontal": {
                                            "name": "Horizontal",
                                            "type": "sub",
                                            "data": {
                                                "min": {
                                                    "name": "Min",
                                                    "type": "int",
                                                    "desc": "The minimum value."
                                                },
                                                "max": {
                                                    "name": "Max",
                                                    "type": "int",
                                                    "desc": "The maximum value."
                                                }
                                            }
                                        },
                                        "x": {
                                            "name": "X",
                                            "type": "sub",
                                            "data": {
                                                "min": {
                                                    "name": "Min",
                                                    "type": "int",
                                                    "desc": "The minimum value."
                                                },
                                                "max": {
                                                    "name": "Max",
                                                    "type": "int",
                                                    "desc": "The maximum value."
                                                }
                                            }
                                        },
                                        "y": {
                                            "name": "Y",
                                            "type": "sub",
                                            "data": {
                                                "min": {
                                                    "name": "Min",
                                                    "type": "int",
                                                    "desc": "The minimum value."
                                                },
                                                "max": {
                                                    "name": "Max",
                                                    "type": "int",
                                                    "desc": "The maximum value."
                                                }
                                            }
                                        },
                                        "z": {
                                            "name": "Z",
                                            "type": "sub",
                                            "data": {
                                                "min": {
                                                    "name": "Min",
                                                    "type": "int",
                                                    "desc": "The minimum value."
                                                },
                                                "max": {
                                                    "name": "Max",
                                                    "type": "int",
                                                    "desc": "The maximum value."
                                                }
                                            }
                                        }
                                    }
                                },
                                "duration": {
                                    "name": "Duration",
                                    "type": "multi",
                                    "desc": "The duration of the levitation in ticks.",
                                    "panel": true,
                                    "options": ["simple", "extra"],
                                    "types": ["int", "sub"],
                                    "data": {
                                        1: {
                                            "min": {
                                                "name": "Min",
                                                "type": "int",
                                                "desc": "The minimum value."
                                            },
                                            "max": {
                                                "name": "Max",
                                                "type": "int",
                                                "desc": "The maximum value."
                                            }
                                        }
                                    }
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:location": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "location": {
                                    "name": "Location",
                                    "type": "list",
                                    "desc": "The location of the player.",
                                    "data": location_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:nether_travel": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "entered": {
                                    "name": "Entered",
                                    "type": "list",
                                    "desc": "The location where the player entered the Nether.",
                                    "data": location_tags_data
                                },
                                "exited": {
                                    "name": "Exited",
                                    "type": "list",
                                    "desc": "The location where the player exited the Nether.",
                                    "data": location_tags_data
                                },
                                "distance": {
                                    "name": "Distance",
                                    "type": "sub",
                                    "desc": "The overworld distance between where the player entered the Nether and where the player exited the Nether.",
                                    "data": {
                                        "absolute": {
                                            "name": "Absolute",
                                            "type": "sub",
                                            "data": {
                                                "min": {
                                                    "name": "Min",
                                                    "type": "double",
                                                    "desc": "The minimum value."
                                                },
                                                "max": {
                                                    "name": "Max",
                                                    "type": "double",
                                                    "desc": "The maximum value."
                                                }
                                            }
                                        },
                                        "horizontal": {
                                            "name": "Horizontal",
                                            "type": "sub",
                                            "data": {
                                                "min": {
                                                    "name": "Min",
                                                    "type": "double",
                                                    "desc": "The minimum value."
                                                },
                                                "max": {
                                                    "name": "Max",
                                                    "type": "double",
                                                    "desc": "The maximum value."
                                                }
                                            }
                                        },
                                        "x": {
                                            "name": "X",
                                            "type": "sub",
                                            "data": {
                                                "min": {
                                                    "name": "Min",
                                                    "type": "double",
                                                    "desc": "The minimum value."
                                                },
                                                "max": {
                                                    "name": "Max",
                                                    "type": "double",
                                                    "desc": "The maximum value."
                                                }
                                            }
                                        },
                                        "y": {
                                            "name": "Y",
                                            "type": "sub",
                                            "data": {
                                                "min": {
                                                    "name": "Min",
                                                    "type": "double",
                                                    "desc": "The minimum value."
                                                },
                                                "max": {
                                                    "name": "Max",
                                                    "type": "double",
                                                    "desc": "The maximum value."
                                                }
                                            }
                                        },
                                        "z": {
                                            "name": "Z",
                                            "type": "sub",
                                            "data": {
                                                "min": {
                                                    "name": "Min",
                                                    "type": "double",
                                                    "desc": "The minimum value."
                                                },
                                                "max": {
                                                    "name": "Max",
                                                    "type": "double",
                                                    "desc": "The maximum value."
                                                }
                                            }
                                        }
                                    }
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:placed_block": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "block": {
                                    "name": "Block",
                                    "type": "ns",
                                    "desc": "The block that was placed. Accepts block IDs."
                                },
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": "The item that was used to place the block before the item was consumed.",
                                    "data": item_tags_data
                                },
                                "location": {
                                    "name": "Location",
                                    "type": "list",
                                    "desc": "The location of the block that was placed.",
                                    "data": location_tags_data
                                },
                                "state": {
                                    "name": "State",
                                    "type": "nlist",
                                    "desc": "",
                                    "data": {
                                        "": {
                                            "type": "text"
                                        }
                                    }
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:player_generates_container_loot": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "loot_table": {
                                    "name": "Loot Table",
                                    "type": "ns",
                                    "desc": "The resource location of the generated loot table."
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:player_hurt_entity": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "damage": damage_predicate_super,
                                "entity": {
                                    "name": "Entity",
                                    "type": "list",
                                    "desc": "The entity that was damaged. May be a list of predicates that must pass in order for the trigger to activate.",
                                    "data": entity_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:player_interacted_with_entity": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": "The item which was in the player's hand during interaction.",
                                    "data": item_tags_data
                                },
                                "entity": {
                                    "name": "Entity",
                                    "type": "list",
                                    "desc": "The entity which was interacted with. May be a list of predicates that must pass in order for the trigger to activate.",
                                    "data": entity_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:player_killed_entity": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "entity": {
                                    "name": "Entity",
                                    "type": "list",
                                    "desc": "The entity that was killed.",
                                    "data": entity_tags_data
                                },
                                "killing_blow": {
                                    "name": "Killing Blow",
                                    "type": "sub",
                                    "desc": "The type of damage that killed an entity.",
                                    "data": damage_predicate
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:recipe_unlocked": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "recipe": {
                                    "name": "Recipe",
                                    "type": "ns",
                                    "desc": "The recipe that was unlocked."
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:shot_crossbow": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": "The item that was used.",
                                    "data": item_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:slept_in_bed": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "location": {
                                    "name": "Location",
                                    "type": "list",
                                    "desc": "The location of the player when they sleep in a bed.",
                                    "data": location_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:slide_down_block": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "block": {
                                    "name": "Block",
                                    "type": "ns",
                                    "desc": "The block that the player slid on."
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:summoned_entity": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "entity": {
                                    "name": "Entity",
                                    "type": "list",
                                    "desc": "The summoned entity. This does not work with spawn eggs, commands, and mob spawners.",
                                    "data": entity_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:tame_animal": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "entity": {
                                    "name": "Entity",
                                    "type": "list",
                                    "desc": "Checks the entity that was tamed.",
                                    "data": entity_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:target_hit": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "signal_strength": {
                                    "name": "Signal Strength",
                                    "type": "int",
                                    "desc": "The redstone signal that will come out of the target block."
                                },
                                "projectile": {
                                    "name": "Projectile",
                                    "type": "ns",
                                    "desc": "The projectile used to hit the target block."
                                },
                                "shooter": {
                                    "name": "Shooter",
                                    "type": "list",
                                    "desc": "Entity predicate for the player who shot or threw the projectile.",
                                    "data": predicate_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:thrown_item_picked_up_by_entity": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": "The thrown item which was picked up.",
                                    "data": item_tags_data
                                },
                                "entity": {
                                    "name": "Entity",
                                    "type": "list",
                                    "desc": "The entity which picked up the item.",
                                    "data": entity_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:used_ender_eye": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "distance": {
                                    "name": "Distance",
                                    "type": "multi",
                                    "desc": "The horizontal distance between the player and the stronghold.",
                                    "panel": true,
                                    "options": ["simple", "extra"],
                                    "types": ["double", "sub"],
                                    "data": {
                                        1: {
                                            "min": {
                                                "name": "Min",
                                                "type": "double",
                                                "desc": "The minimum value."
                                            },
                                            "max": {
                                                "name": "Max",
                                                "type": "double",
                                                "desc": "The maximum value."
                                            }
                                        }
                                    }
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:used_totem": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": "The item, only works with totem items.",
                                    "data": item_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:villager_trade": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "item": {
                                    "name": "Item",
                                    "type": "sub",
                                    "desc": 'The item that was purchased. The "count" tag checks the count from one trade, not multiple.',
                                    "data": item_tags_data
                                },
                                "villager": {
                                    "name": "Villager",
                                    "type": "list",
                                    "desc": "The villager the item was purchased from.",
                                    "data": entity_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    },
                    "minecraft:voluntary_exile": {
                        "conditions": {
                            "name": "Conditions",
                            "type": "sub",
                            "desc": "All the conditions that need to be met when the trigger gets activated.",
                            "data": {
                                "location": {
                                    "name": "Location",
                                    "type": "list",
                                    "desc": "The location of the player when they start a raid.",
                                    "data": location_tags_data
                                },
                                "player": {
                                    "name": "Player",
                                    "type": "list",
                                    "desc": "A list of predicates that must pass in order for the trigger to activate. The checks are applied to the player that would get the advancement.",
                                    "data": predicate_data
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "requirements": {
        "name": "Requirements",
        "type": "list",
        "desc": "An optional list of requirements (all the <criteriaNames>). If all criteria are required, this may be omitted. With multiple criteria: requirements contains a list of lists with criteria (all criteria need to be mentioned). If all of the lists each have any criteria met, the advancement is complete. (basically AND grouping of OR groups, with items split by line).",
        "data": {
            "": {
                "type": "textlist"
            }
        }
    },
    "rewards": {
        "name": "Rewards",
        "type": "sub",
        "desc": "An optional object representing the rewards provided when this advancement is obtained.",
        "recipes": {
            "name": "Recipes",
            "type": "list",
            "desc": "A list of recipes to unlock.",
            "data": {
                "": {
                    "type": "ns"
                }
            }
        },
        "loot": {
            "name": "Loot",
            "type": "list",
            "desc": "A list of loot tables to give to the player.",
            "loot": {
                "": {
                    "type": "ns"
                }
            }
        },
        "experience": {
            "name": "XP",
            "type": "int",
            "desc": "An amount of experience.",
        },
        "function": {
            "name": "Function",
            "type": "ns",
            "desc": "A function to run. Function tags are not allowed."
        }
    }
};

var cooking_recipe_data = {
    "group": {
        "name": "Group",
        "type": "text",
        "desc": "A string identifier used to group multiple recipes together in the recipe book."
    },
    "ingredient": {
        "name": "Ingredient",
        "type": "ace",
        "desc": "The ingredient(s) used in this recipe."
    },
    "result": {
        "name": "Result",
        "type": "ns",
        "desc": "An item specifying the output of this recipe."
    },
    "experience": {
        "name": "XP",
        "type": "double",
        "desc": "The output experience of the recipe."
    },
    "cookingtime": {
        "name": "Cooking Time",
        "type": "int",
        "desc": "Optional. The cook time of the recipe in ticks. Will fallback to the default time (100 ticks, or 5 seconds, or double that for normal smelting) if the field is absent."
    }
};
var single_item_recipe_data = {
    "group": {
        "name": "Group",
        "type": "text",
        "desc": "A string identifier used to group multiple recipes together in the recipe book."
    },
    "ingredient": {
        "name": "Ingredient",
        "type": "ace",
        "desc": "The ingredient(s) used in this recipe."
    },
    "result": {
        "name": "Result",
        "type": "ns",
        "desc": "An item specifying the output of this recipe."
    },
    "count": {
        "name": "Count",
        "type": "int",
        "desc": "The amount of the output item."
    }
};
var shapeless_recipe_data = {
    "group": {
        "name": "Group",
        "type": "text",
        "desc": "A string identifier used to group multiple recipes together in the recipe book."
    },
    "ingredients": {
        "name": "Ingredients",
        "type": "ace",
        "desc": "The ingredients used in this recipe."
    },
    "result": {
        "name": "Result",
        "type": "ns",
        "desc": "An item specifying the output of this recipe."
    },
    "count": {
        "name": "Count",
        "type": "int",
        "desc": "The amount of the output item."
    }
};
var recipe_data = {
    "id": {
        "type": "info",
        "info": "<a href='https://minecraft.gamepedia.com/Recipe'>Wiki Format</a>"
    },
    "type": {
        "name": "Type",
        "type": "options",
        "desc": "The type of recipe.",
        "more": "__type_options"
    },
    "__type_options": {
        "type": "more",
        "parent": "type",
        "data": {
            "minecraft:crafting_shaped": {
                "pattern": {
                    "name": "Pattern",
                    "type": "textlist",
                    "desc": "One or more lines of single-character keys used to describe a pattern for shaped crafting. All lines need to have the same amount of keys. A space can be used to indicate an empty spot."
                },
                "key": {
                    "name": "Key",
                    "type": "nlist",
                    "desc": "All keys used for this shaped crafting recipe. Each key's name must be unique and the same as the symbol used to define it in the pattern.",
                    "data": {
                        "": {
                            "type": "ace"
                        }
                    }
                },
                "result": {
                    "name": "Result",
                    "type": "sub",
                    "desc": "The output item of the recipe.",
                    "data": {
                        "item": {
                            "name": "Item ID",
                            "type": "ns",
                            "desc": "An item ID of the recipe to craft."
                        },
                        "count": {
                            "name": "Count",
                            "type": "int",
                            "desc": "The amount of the item to craft from this recipe."
                        },
                        "nbt": {
                            "name": "NBT",
                            "type": "textarea",
                            "desc": "NBT of the output item crafted. Note that this is NOT supported by vanilla Minecraft, and is only here because other mods do support it."
                        }
                    }
                }
            },
            "minecraft:crafting_shapeless": shapeless_recipe_data,
            "minecraft:blasting": cooking_recipe_data,
            "minecraft:campfire_cooking": cooking_recipe_data,
            "minecraft:smelting": cooking_recipe_data,
            "minecraft:smoking": cooking_recipe_data,
            "minecraft:stonecutting": single_item_recipe_data,
            "minecraft:smithing": {
                "base": {
                    "name": "Base",
                    "type": "sub",
                    "desc": "Ingredient specifying an item to be upgraded.",
                    "data": {
                        "item": {
                            "name": "Item ID",
                            "type": "ns",
                            "desc": "An item ID of the item."
                        },
                        "tag": {
                            "name": "Tag",
                            "type": "int",
                            "desc": "If specified, any of these items will work for this item."
                        }
                    }
                },
                "addition": {
                    "name": "Addition",
                    "type": "sub",
                    "desc": "Ingredient specifying what item(s) can be used to upgrade this other item.",
                    "data": {
                        "item": {
                            "name": "Item ID",
                            "type": "ns",
                            "desc": "An item ID of the item."
                        },
                        "tag": {
                            "name": "Tag",
                            "type": "int",
                            "desc": "If specified, any of these items will work for this item."
                        }
                    }
                },
                "result": {
                    "name": "Result",
                    "type": "sub",
                    "desc": "Item specifying the resulting type of the upgraded item. The resulting item copies the NBT tags of the base item.",
                    "data": {
                        "item": {
                            "name": "Item ID",
                            "type": "ns",
                            "desc": "An item ID of the item."
                        }
                    }
                }
            }
        }
    }
};

var i_recipe_data = {};
Object.assign(i_recipe_data, recipe_data);
i_recipe_data.id = {
    "name": "ID",
    "type": "ns",
    "desc": "Any arbitrary (but unique) identifier. It is required, so you cannot skip it."
};

var loot_entry_copy = {};
var item_function_data = {
    "minecraft:apply_bonus": {
        "enchantment": {
            "name": "Enchantment",
            "type": "ns",
            "desc": "Enchantment ID used for level calculation."
        },
        "formula": {
            "name": "Formula",
            "type": "options",
            "desc": 'Can be "binomial_with_bonus_count" for a binomial distribution (with n=level + extra, p=probability), "uniform_bonus_count" for uniform distribution (from 0 to level * bonusMultiplier), or "ore_drops" for a special function used for ore drops in the vanilla game (Count * (max(0; random(0..Level + 2) - 1)+1))."',
            "options": ["binomial_with_bonus_count", "uniform_bonus_count", "ore_drops"]
        },
        "parameters": {
            "name": "Parameters",
            "type": "sub",
            "desc": "Values required for the formula.",
            "data": {
                "extra": {
                    "name": "Extra",
                    "type": "int",
                    "desc": "For formula 'binomial_with_bonus_count', the extra value"
                },
                "probability": {
                    "name": "Probability",
                    "type": "double",
                    "desc": "For formula 'binomial_with_bonus_count', the probability."
                },
                "bonusMultiplier": {
                    "name": "Bonus Multiplier",
                    "type": "double",
                    "desc": "For formula 'uniform_bonus_count', the bonus multiplier."
                }
            }
        }
    },
    "minecraft:copy_name": {
        "source": {
            "name": "Source",
            "type": "options",
            "desc": "For loot table type 'block', copies a block entity's CustomName tag into the item's display.Name tag.",
            "options": ["block_entity"]
        }
    },
    "minecraft:copy_nbt": {
        "source": {
            "name": "Source",
            "type": "multi",
            "panel": true,
            "desc": "Specifies the source. Set to block_entity for the block entity of the destroyed block, this to use the entity that died or the player that gained the advancement, opened the container or broke the block, killer for the killer, or killer_player for a killer that is a player. You can also specify a dictionary nbt provider type.",
            "options": ["simple", "extra"],
            "types": ["ns", "sub"],
            "data": {
                1: {
                    "type": {
                        "name": "Provider",
                        "type": "options",
                        "desc": "Nbt provider type. One of context, storage.",
                        "more": "__type_options"
                    },
                    "__type_options": {
                        "type": "more",
                        "parent": "type",
                        "data": {
                            "context": {
                                "target": {
                                    "name": "Target",
                                    "type": "text",
                                    "desc": "Same as the simple variant of source."
                                }
                            },
                            "storage": {
                                "source": {
                                    "name": "Source",
                                    "type": "ns",
                                    "desc": "A resource location specifying the storage ID."
                                }
                            }
                        }
                    }
                }
            }
        },
        "ops": {
            "name": "Ops",
            "type": "list",
            "desc": "A list of copy operations.",
            "data": {
                "source": {
                    "name": "Source",
                    "type": "text",
                    "desc": "The nbt path to copy from."
                },
                "target": {
                    "name": "Target",
                    "type": "text",
                    "desc": "The nbt path to copy to, starting from the item's 'tag' tag."
                },
                "op": {
                    "name": "Operation",
                    "type": "options",
                    "desc": 'Can be "replace" to replace any existing contents of the target, "append" to append to a list, or "merge" to merge into a compound tag.',
                    "options": ["replace", "append", "merge"]
                }
            }
        }
    },
    "minecraft:copy_state": {
        "block": {
            "name": "Block ID",
            "type": "ns",
            "desc": "A block ID. Function fails if the block doesn't match."
        },
        "properties": {
            "name": "Properties",
            "type": "textlist",
            "desc": "List of property names to copy, split by line."
        }
    },
    "minecraft:enchant_randomly": {
        "enchantments": {
            "name": "Enchantments",
            "type": "textlist",
            "desc": "List of enchantment IDs split by line to randomly choose from to enchant the item with a random level of. Only one will be picked. If omitted, all enchantments applicable to the item are possible."
        }
    },
    "minecraft:enchant_with_levels": {
        "treasure": {
            "name": "Treasure",
            "type": "checkbox",
            "desc": "Determines whether treasure enchantments are allowed on this item.",
            "default": false
        },
        "levels": levels_number_provider
    },
    "minecraft:exploration_map": {
        "destination": {
            "name": "Destination",
            "type": "ns",
            "desc": "The type of generated structure to locate. Accepts any of the StructureTypes used by the /locate command (case insensitive)."
        },
        "decoration": {
            "name": "Decoration",
            "type": "ns",
            "desc": "The icon used to mark the destination on the map. Accepts any of the map icon text IDs (Click to go to wiki). If mansion or monument is used, the color of the lines on the item texture changes to match the corresponding explorer map.",
            "link": "https://minecraft.gamepedia.com/Map#Map_icons"
        },
        "zoom": {
            "name": "Zoom",
            "type": "int",
            "desc": "The zoom level of the resulting map. Defaults to 2.",
            "default": 2
        },
        "search_radius": {
            "name": "Search Radius",
            "type": "int",
            "desc": "The size, in chunks, of the area to search for structures. The area checked is square, not circular. Radius 0 causes only the current chunk to be searched, radius 1 causes the current chunk and eight adjacent chunks to be searched, and so on. Defaults to 50.",
            "default": 50
        },
        "skip_existing_chunks": {
            "name": "Skip Existing",
            "type": "checkbox",
            "desc": "Don't search in chunks that have already been generated. Defaults to true.",
            "default": true
        }
    },
    "minecraft:explosion_decay": {},
    "minecraft:furnace_smelt": {},
    "minecraft:fill_player_head": {
        "entity": {
            "name": "Entity",
            "type": "text",
            "desc": "Specifies an entity to be used for the player head. Set to this to use the entity that died or the player that gained the advancement, opened the container or broke the block, killer for the killer, or killer_player for a killer that is a player."
        }
    },
    "minecraft:limit_count": {
        "limit": limit_number_provider
    },
    "minecraft:looting_enchant": {
        "count": count_number_provider,
        "limit": {
            "name": "Limit",
            "type": "int",
            "desc": "Specifies the maximum amount of items in the stack after the looting calculation. If the value is 0, no limit is applied.",
        }
    },
    "minecraft:set_attributes": {
        "modifiers": {
            "name": "Modifiers",
            "type": "list",
            "desc": "Attribute modifiers to add to the item.",
            "data": {
                "name": {
                    "name": "Name",
                    "type": "text",
                    "desc": "Name of the modifier"
                },
                "attribute": {
                    "name": "Attribute",
                    "type": "text",
                    "desc": "The name of the attribute this modifier is to act upon."
                },
                "operation": {
                    "name": "Operation",
                    "type": "options",
                    "desc": 'Must be either "addition", "multiply_base" or "multiply_total".',
                    "options": ["addition", "multiply_base", "multiply_total"]
                },
                "amount": amount_number_provider,
                "id": {
                    "name": "ID",
                    "type": "text",
                    "desc": "Optional: UUID of the modifier following. If none specified, a new UUID is generated."
                },
                "slot": {
                    "name": "Slot",
                    "type": "multi",
                    "desc": 'Slots the item must be in for the modifier to take effect. Values can be one of the following: "mainhand", "offhand", "feet", "legs", "chest", or "head". If list, one will be chosen randomly.',
                    "panel": true,
                    "options": ["simple", "textlist"],
                    "types": ["text", "textlist"]
                }
            }
        }
    },
    "minecraft:set_banner_pattern‌": {
        "patterns": {
            "name": "Patterns",
            "type": "list",
            "desc": "List of patterns to apply to a banner. 1.17+ only",
            "data": {
                "pattern": {
                    "name": "Pattern",
                    "type": "text",
                    "desc": "The pattern type. Click to see vanilla types, but not their ids. For example, square_bottom_left",
                    "link": "https://minecraft.gamepedia.com/Banner/Patterns"
                },
                "color": {
                    "name": "Color",
                    "type": "options",
                    "desc": "The color of this pattern.",
                    "options": ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"]
                }
            }
        },
        "append": {
            "name": "Append",
            "type": "checkbox",
            "desc": "Optional. If true, new patterns will be appended to existing ones.",
            "default": false
        }
    },
    "minecraft:set_contents": {
        "entries": {
            "name": "Entries",
            "type": "list",
            "desc": "For loot tables of type 'block', this is a list of entries to set as the contents of a container block item.",
            "data": loot_entry_copy
        }
    },
    "minecraft:set_count": {
        "count": count_number_provider,
        "add": {
            "name": "Add",
            "type": "checkbox",
            "desc": "Optional. If true, change will be relative to current count. 1.17+ Only."
        }
    },
    "minecraft:set_damage": {
        "damage": damage_number_provider,
        "add": {
            "name": "Add",
            "type": "checkbox",
            "desc": "Optional. If true, change will be relative to current damage. 1.17+ Only."
        }
    },
    "minecraft:set_enchantments": {
        "enchantments": {
            "name": "Enchantments",
            "type": "ace",
            "desc": "Enchantments to add. Key name is the enchantment ID. Value is a number provider specifying the enchantment level."
        },
        "add": {
            "name": "Add",
            "type": "checkbox",
            "desc": "Optional. If true, change will be relative to the current level."
        }
    },
    "minecraft:set_loot_table": {
        "name": {
            "name": "Loot Table",
            "type": "ns",
            "desc": "Specifies the resource location of the loot table to be used to set the value of the container."
        },
        "seed": {
            "name": "Seed",
            "type": "int",
            "desc": "Optional. Specifies the loot table seed. If absent or set to 0, a random seed will be used."
        }
    },
    "minecraft:set_lore": {
        "lore": {
            "name": "Lore",
            "type": "ace",
            "desc": "List of JSON text components. Each list entry represents one line of the lore."
        },
        "entity": {
            "name": "Entity",
            "type": "text",
            "desc": "Specifies the entity to act as the source @s in the JSON text component. Set to this to use the entity that died or the player that gained the advancement, opened the container or broke the block, killer for the killer, or killer_player for a killer that is a player."
        },
        "replace": {
            "name": "Replace",
            "type": "checkbox",
            "desc": "If true, replaces all existing lines of lore, if false appends the list.",
            "default": true
        }
    },
    "minecraft:set_name": {
        "name": {
            "name": "Name",
            "type": "ace",
            "desc": "A JSON text component name, allowing color, translations, etc."
        },
        "entity": {
            "name": "Entity",
            "type": "text",
            "desc": "Specifies the entity to act as the source @s in the JSON text component. Set to this to use the entity that died or the player that gained the advancement, opened the container or broke the block, killer for the killer, or killer_player for a killer that is a player."
        }
    },
    "minecraft:set_nbt": {
        "tag": {
            "name": "NBT",
            "type": "textarea",
            "desc": "Tag string to add, similar to those used by commands. Note that the first bracket is required."
        }
    },
    "minecraft:set_stew_effect": {
        "effects": {
            "name": "Effects",
            "type": "list",
            "desc": "Sets the status effects for suspicious stew.",
            "data": {
                "type": {
                    "name": "Effect ID",
                    "type": "ns",
                    "desc": "The effect ID to apply."
                },
                "duration": duration_number_provider
            }
        }
    }
};
var loot_function = {
    "conditions": {
        "name": "Conditions",
        "type": "list",
        "desc": "Determines conditions for this function to be applied. If multiple conditions are specified, all must pass.",
        "data": predicate_data
    },
    "function": {
        "name": "Function",
        "type": "options",
        "desc": "Namespaced ID of the function to apply.",
        "more": "__function_options"
    },
    "__function_options": {
        "type": "more",
        "parent": "function",
        "data": item_function_data
    }
};

var loot_entry_data = {
    "weight": {
        "name": "Weight",
        "type": "int",
        "desc": "Determines how often this entry is chosen out of all the entries in the pool. Entries with higher weights are used more often (chance is this entry's weight⁄total of all considered entries' weights)."
    },
    "quality": {
        "name": "Quality",
        "type": "int",
        "desc": "Modifies the entry's weight based on the killing/opening/fishing player's luck attribute. Formula is floor(weight + (quality * generic.luck))."
    },
    "type": {
        "name": "Type",
        "type": "options",
        "desc": "Namespaced ID type of entry. Can be item for item entries, tag for item tags, loot_table to produce items from another loot table, group for child entries, alternatives to select one sub-entry from a list, sequence to select sub-entries until one entry cannot be granted, dynamic to generate block specific drops, or empty for an entry that generates nothing.",
        "more": "__type_options"
    },
    "__type_options": {
        "type": "more",
        "parent": "type",
        "data": {
            "minecraft:item": {
                "name": {
                    "name": "Item ID",
                    "type": "ns",
                    "desc": "ID name of the item to be produced, e.g. diamond. The default, if not changed by functions, is a stack of 1 of the default instance of the item."
                }
            },
            "minecraft:tag": {
                "name": {
                    "name": "Item Tag",
                    "type": "ns",
                    "desc": "Item tag to be used, e.g. minecraft:arrows"
                },
                "expand": {
                    "name": "Expand",
                    "type": "checkbox",
                    "desc": "If set to true, it chooses one item of the tag, each with the same weight and quality. If false, it generates one of each of the items in the tag.",
                    "default": false
                }
            },
            "minecraft:loot_table": {
                "name": {
                    "name": "Loot Table ID",
                    "type": "ns",
                    "desc": "Loot table to be used, e.g. minecraft:gameplay/fishing/junk."
                }
            },
            "minecraft:group": {
                "children": {
                    "name": "Children",
                    "type": "list",
                    "desc": "A list of entries that are used to generate loot. Can be used for convenience, e.g. if one condition applies for multiple entries.",
                    "data": loot_entry_copy
                }
            },
            "minecraft:alternatives": {
                "children": {
                    "name": "Children",
                    "type": "list",
                    "desc": "A list of entries of which the first, and only the first, successful entry gets generated.",
                    "data": loot_entry_copy
                }
            },
            "minecraft:sequence": {
                "children": {
                    "name": "Children",
                    "type": "list",
                    "desc": "A list of entries that are used until the first entry fails. After an entry fails, no more entries of this list are generated.",
                    "data": loot_entry_copy
                }
            },
            "minecraft:dynamic": {
                "name": {
                    "name": "Contents",
                    "type": "textarea",
                    "desc": "Can be contents for block entity contents or self for banners and player skulls."
                }
            },
            "minecraft:empty": {}
        }
    },
    "conditions": {
        "name": "Conditions",
        "type": "list",
        "desc": "Determines conditions for this entry to be used. If multiple conditions are specified, all must pass.",
        "data": predicate_data
    },
    "functions": {
        "name": "Functions",
        "type": "list",
        "desc": "Applies functions to the item stack or item stacks being produced. Functions are applied in order, so for example looting_enchant must be after set_count to work correctly.",
        "data": loot_function
    }
};
Object.assign(loot_entry_copy, loot_entry_data);

var loot_table_data = {
    "info": {
        "type": "info",
        "info": "<a href='https://minecraft.gamepedia.com/Loot_table'>Wiki Format</a>"
    },
    "type": {
        "name": "Type",
        "type": "options",
        "desc": 'Optional type of the loot table. Must be one of "empty" if the loot table does not generate any loot, "entity" for loot an entity drops, "block" for loot a block drops, "chest" for a treasure chest, "fishing" for a fishing loot table, "gift" for a cat or villager gift, "advancement_reward" if it\'s used as a reward for an advancement, "barter" for loot from bartering with piglins, "command" for /execute (if|unless) predicate, "selector" for predicate= in selectors, "advancement_entity" for entity predicates in advancements or "generic" if none of the above apply.',
        "options": [" ", "empty", "entity", "block", "chest", "fishing", "gift", "advancement_reward", "barter", "command", "selector", "advancement_entity", "generic"]
    },
    "functions": {
        "name": "Functions",
        "type": "list",
        "desc": "Applies functions to all item stacks produced by this table. Functions are applied in order, so for example looting_enchant must be after set_count to work correctly.",
        "data": loot_function
    },
    "pools": {
        "name": "Pools",
        "type": "list",
        "desc": "A list of all pools for this loot table. Each pool used generates items from its list of items based on the number of rolls. Pools are applied in order.",
        "data": {
            "conditions": {
                "name": "Conditions",
                "type": "list",
                "desc": "Determines conditions for this pool to be used. If multiple conditions are specified, all must pass.",
                "data": predicate_data
            },
            "functions": {
                "name": "Functions",
                "type": "list",
                "desc": "Applies functions to all item stacks produced by this pool. Functions are applied in order, so for example looting_enchant must be after set_count to work correctly.",
                "data": loot_function
            },
            "rolls": rolls_number_provider,
            "bonus_rolls": bonus_number_provider,
            "entries": {
                "name": "Entries",
                "type": "list",
                "desc": "A list of all things that can be produced by this pool. One entry is chosen per roll as a weighted random selection from all entries without failing conditions.",
                "data": loot_entry_data
            }
        }
    }
};

var extforms = {
    "predicates": predicate_data,
    "advancements": advancement_data,
    "recipes": recipe_data,
    "loot_tables": loot_table_data
};