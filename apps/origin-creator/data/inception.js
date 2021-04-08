var inception_data = {};
inception_data.name = {
    "name": "Name",
    "type": "ns"
};
inception_data.type = {
    "name": "Type",
    "type": "options",
    "more": "__type_options"
};
inception_data.desc = {
    "name": "Description",
    "type": "textarea"
};
inception_data.__type_options = {
    "type": "more",
    "parent": "type",
    "data": {
        "info": {
            "info": {
                "name": "Info",
                "type": "textarea"
            }
        },
        "main": {
            "default": {
                "name": "Default",
                "type": "text"
            }
        },
        "ns": {
            "default": {
                "name": "Default",
                "type": "text"
            }
        },
        "id": {
            "default": {
                "name": "Default",
                "type": "text"
            }
        },
        "text": {
            "default": {
                "name": "Default",
                "type": "text"
            }
        },
        "int": {
            "default": {
                "name": "Default",
                "type": "int"
            }
        },
        "double": {
            "default": {
                "name": "Default",
                "type": "double"
            }
        },
        "checkbox": {
            "default": {
                "name": "Default",
                "type": "bool"
            }
        },
        "bool": {
            "default": {
                "name": "Default",
                "type": "bool"
            }
        },
        "image": {},
        "ace": {},
        "textarea": {
            "default": {
                "name": "Default",
                "type": "text"
            }
        },
        "textlist": {},
        "sub": {
            "data": {
                "name": "Data",
                "type": "nlist",
                "data": inception_data
            }
        },
        "list": {
            "data": {
                "name": "Data",
                "type": "nlist",
                "data": inception_data
            }
        },
        "nlist": {
            "data": {
                "name": "Data",
                "type": "nlist",
                "data": inception_data
            }
        },
        "options": {
            "options": {
                "name": "Options",
                "type": "textlist"
            },
            "more": {
                "name": "More",
                "type": "text"
            }
        },
        "more": {
            "parent": {
                "name": "Parent",
                "type": "text"
            },
            "data": {
                "name": "Data",
                "type": "nlist",
                "data": inception_data
            }
        },
        "multi": {
            "options": {
                "name": "Options",
                "type": "textlist"
            },
            "types": {
                "name": "Types",
                "type": "textlist"
            },
            "data": {
                "name": "Data",
                "type": "ace",
                "desc": "You know why this is not currently possible to make."
            }
        }
    }
};

var inception = {
    "data": {
        "type": "nlist",
        "data": inception_data
    }
};