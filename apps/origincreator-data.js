var condition = {
    "name": "Condition",
    "type": "options",
    "desc": "ID of a player condition that this thing depends on in order to work. Check the wiki for more information.",
    "more": "condition_options"
};
var condition_options = {};
condition_options.name = "";
condition_options.type = "more";
condition_options.desc = "Options specific to the type of player condition.";
condition_options.parent = "condition";
condition_options.data = {
    "none": {},
    "origins:and": {
        "inverted": {
            "name": "Inverted",
            "type": "checkbox",
            "desc": "If set to true, Origins will instead check that this condition is NOT fulfilled."
        },
        "conditions": {
            "name": "Conditions",
            "type": "list",
            "desc": "All of these need to evaluate to true in order for the whole condition to be true.",
            "data": {
                "condition": condition,
                "condition_options": condition_options
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

var subforms = {
    "origin-id": {
        "id": {
            "name": "ID",
            "type": "ns",
            "desc": "Namespaced ID of the origin for use.",
            "default": "myorigins:cool_origin"
        },
        "condition": condition,
        "condition_options": condition_options
    },
    "power-id": {
        "ID": {
            "name": "ID",
            "type": "text",
            "desc": "Namespaced ID of the power for use.",
            "default": "myorigins:cool_power"
        }
    },
    "upgrade": {
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
    },
    "aamodifier": {
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
            "data": subforms["origin-id"]
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
            "data": subforms["power-id"]
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
            "data": subforms["upgrade"]
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
            "more": "type_options"
        },
        "type_options": {
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
                        "data": subforms["aamodifier"]
                    }
                },
                "origins:conditioned_attribute": {
                    "condition": condition,
                    "condition_options": condition_options,
                    "tick_rate": tick_rate,
                    "modifiers": {
                        "name": "AA Modifiers",
                        "type": "list",
                        "desc": "If specified, these modifiers will be applied to their corresponding attributes.",
                        "data": subforms["aamodifier"]
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