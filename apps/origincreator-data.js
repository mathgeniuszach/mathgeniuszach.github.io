var condition_data = {};

condition_data.type = {
    "name": "Type",
    "type": "options",
    "desc": "The most important field in the condition. Specifies an ID of a condition to check for.",
    "more": "_type_options"
};
condition_data.inverted = {
    "name": "Inverted",
    "type": "checkbox",
    "desc": "If set to true, Origins will instead check that this condition is NOT fulfilled."
};
condition_data._type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "none": {},
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
                "desc": "By how much of the bounding box size should the box be offset in the X direction (e.g.: 0 = no offset, 1 = offset of exact width, 2 = offset of twice the width of the bounding box)"
            },
            "offset_y": {
                "name": "Offset Y",
                "type": "double",
                "desc": "By how much of the bounding box size should the box be offset in the Y direction (e.g.: 0 = no offset, 1 = offset of exact width, 2 = offset of twice the width of the bounding box)"
            },
            "offset_z": {
                "name": "Offset Z",
                "type": "double",
                "desc": "By how much of the bounding box size should the box be offset in the Z direction (e.g.: 0 = no offset, 1 = offset of exact width, 2 = offset of twice the width of the bounding box)"
            }
        },
        "origins:brightness": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": 'How to compare the brightness against the specified value.',
                "options": ["<", ">", ">=", "<=", "=="]
            },
            "compare_to": {
                "name": "Brightness",
                "type": "double",
                "desc": "Which value to compare the brightness against."
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
                "desc": "ID of the status effect the player should have."
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
                "options": ["<", ">", ">=", "<=", "=="]
            },
            "compare_to": {
                "name": "Fluid Height",
                "type": "double",
                "desc": "Which value the fluid height should be compared to."
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
                "options": ["<", ">", ">=", "<=", "=="]
            },
            "compare_to": {
                "name": "Fool Level",
                "type": "int",
                "desc": "Which value to compare the food level against."
            }
        },
        "origins:saturation_level": {
            "comparison": {
                "name": "Comparison",
                "type": "options",
                "desc": 'How to compare the saturation level against the specified value.',
                "options": ["<", ">", ">=", "<=", "=="]
            },
            "compare_to": {
                "name": "Saturation Level",
                "type": "double",
                "desc": "Which value to compare the saturation level against."
            }
        }
    }
};

var condition = {
    "name": "Condition",
    "type": "sub",
    "desc": "A player condition that this thing depends on in order to work. Check the wiki for more information.",
    "data": condition_data
};
var tick_rate = {
    "name": "Tick Rate",
    "type": "int",
    "desc": "The frequency (in ticks) with which to check the condition. Lower values mean the condition changes are detected more quickly, but this comes at a potentially huge performance cost.",
    "default": 20
};

var aamodifier = {
    "attribute": {
        "name": "Attribute ID",
        "type": "ns",
        "desc": "ID of the attribute which will be modified by this modifier."
    },
    "operation": {
        "name": "Operation",
        "type": "options",
        "desc": "The operation which will be performed by this modifier.",
        "options": ["addition", "multiply_base", "multiply_total"]
    },
    "value": {
        "name": "Value",
        "type": "double",
        "desc": "The value with which to apply the operation to the attribute."
    },
    "name": {
        "name": "Name",
        "type": "text",
        "desc": "A descriptive name for the modifier, describing where it comes from."
    }
};

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
            "desc": "If your work is being exported to a mod, you can use this to specify a mod id. If not specified, it will be based on the display name."
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
        }
    },
    "layer": {
        "id": {
            "name": "ID",
            "type": "id",
            "desc": "Namespaced ID of the layer. Use '/'s to define folders."
        },
        "replace": {
            "name": "Replace",
            "type": "checkbox",
            "desc": "Whether or not to replace an already existing layer in another pack."
        },
        "origins": {
            "name": "Origins",
            "type": "list",
            "desc": "Origins to include in this layer.",
            "data": {
                "id": {
                    "name": "ID",
                    "type": "ns",
                    "desc": "Namespaced ID of the origin for use."
                },
                "condition": condition
            }
        }
    },
    "origin": {
        "id": {
            "name": "ID",
            "type": "id",
            "desc": "Namespaced ID of the origin. Use '/'s to define folders. If not specified, it will be based on the display name."
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
            "desc": "The impact value of the origin, where 0 = none, 1 = low, 2 = medium, 3 = high."
        },
        "order": {
            "name": "Order",
            "type": "int",
            "desc": "In the origin screen, origins are sorted first by impact, and second by this order value, where lower values come first."
        },
        "powers": {
            "name": "Powers",
            "type": "list",
            "desc": "A list of powers which this origin should have.",
            "data": {
                "id": {
                    "name": "ID",
                    "type": "text",
                    "desc": "Namespaced ID of the power for use."
                }
            }
        },
        "loading_priority": {
            "name": "Load Priority",
            "type": "int",
            "desc": "Origins with higher loading priority override origins registered under the same ID with a lower loading priority. Use a value greater than 0 if you want to override origins added by the mod itself."
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
                    "type": "text",
                    "desc": "Origin to upgrade to when the advancement has been met."
                },
                "announcement": {
                    "name": "Announcement",
                    "type": "textarea",
                    "desc": "Message sent to chat when a player acquires this upgrade."
                }
            }
        }
    },
    "power": {
        "id": {
            "name": "ID",
            "type": "id",
            "desc": "Namepsaced ID of the power. Use '/'s to define folders. If not specified, it will be based on the display name."
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
            "desc": "Powers with higher loading priority override powers registered under the same ID with a lower loading priority. Use a value greater than 0 if you want to override powers added by the mod itself."
        },
        "hidden": {
            "name": "Hidden",
            "type": "checkbox",
            "desc": "If set to true, this power will not show up in the list of powers an origin has."
        },
        "type": {
            "name": "Type",
            "type": "options",
            "desc": "The most important field. ID of a power type, defining how this power behaves and which other fields are required. Check the wiki for more information.",
            "more": "_type_options"
        },
        "_type_options": {
            "name": "",
            "type": "more",
            "desc": "Options specific to the type of power.",
            "parent": "type",
            "data": {
                "origins:simple": {},
                "origins:toggle": {
                    "active_by_default": {
                        "name": "Active by Default",
                        "type": "checkbox",
                        "desc": "Whether this power starts in the on or off state.",
                        "default": true
                    },
                    "key": {
                        "name": "Key",
                        "type": "options",
                        "desc": "Which active key this power should respond to.",
                        "options": ["primary", "secondary"],
                        "default": "primary"
                    }
                },
                "origins:attribute": {
                    "modifiers": {
                        "name": "AA Modifiers",
                        "type": "list",
                        "desc": "If specified, these modifiers will be applied to their corresponding attributes.",
                        "data": aamodifier
                    }
                },
                "origins:conditioned_attribute": {
                    "condition": condition,
                    "tick_rate": tick_rate,
                    "modifiers": {
                        "name": "AA Modifiers",
                        "type": "list",
                        "desc": "If specified, these modifiers will be applied to their corresponding attributes.",
                        "data": aamodifier
                    }
                },
                "origins:burn": {
                    "interval": {
                        "name": "Interval",
                        "type": "int",
                        "desc": "Interval between being set on fire, in ticks."
                    },
                    "burn_duration": {
                        "name": "Burn Duration",
                        "type": "int",
                        "desc": "Time the fire should last on the player each time it is set, in seconds."
                    }
                }
            }
        }
    }
};