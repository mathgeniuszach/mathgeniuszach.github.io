
// This only defines high-level behaviour of the Mode like folding etc.
ace.define("ace/mode/mcfunction", ["require", "exports", "ace/lib/oop", "ace/mode/text", "ace/mode/mcfunction_highlight_rules"], (acequire, exports) => {
    const oop = acequire("ace/lib/oop");
    const TextMode = acequire("ace/mode/text").Mode;
    const CustomHighlightRules = acequire("./mcfunction_highlight_rules").CustomHighlightRules;

    var FoldMode = acequire("./folding/cstyle").FoldMode;

    var Mode = function () {
        this.HighlightRules = CustomHighlightRules;
        this.foldingRules = new FoldMode();
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode); // ACE's way of doing inheritance

    exports.Mode = Mode; // eslint-disable-line no-param-reassign
});

// This is where we really create the highlighting rules
ace.define("ace/mode/mcfunction_highlight_rules", ["require", "exports", "ace/lib/oop", "ace/mode/text_highlight_rules"], (acequire, exports) => {
    const oop = acequire("ace/lib/oop");
    const TextHighlightRules = acequire("ace/mode/text_highlight_rules").TextHighlightRules;

    const CustomHighlightRules = function CustomHighlightRules() {
        this.$rules = {
            "start": [
                {
                    "token": "comment",
                    "regex": "(\\s*#.*?$)",
                    "push": "main__1"
                },
                {
                    "token": "support.function.dom",
                    "regex": "(\\s*/?(execute|\\$)( |$))",
                    "push": "main__2"
                },
                {
                    "token": "support.type",
                    "regex": "(\\s*/?(scoreboard|data)( |$))",
                    "push": "main__3"
                },
                {
                    "token": "support.function",
                    "regex": "(\\s*/?function( |$))",
                    "push": "main__4"
                },
                {
                    "token": "support.function",
                    "regex": "(\\s*/?(say|script\\s+run)?( |$))",
                    "push": "main__5"
                },
                {
                    "token": "support.function",
                    "regex": "(\\s*(\\.|.*?( |$)))",
                    "push": "main__6"
                },
                {
                    defaultToken: "text",
                }
            ],
            "args__1": [
                {
                    "token": "text",
                    "regex": "((?!\\[))",
                    "next": "pop"
                },
                {
                    "token": "support.class",
                    "regex": "(\\[)",
                    "push": "selector_inside"
                },
                {
                    defaultToken: "text",
                }
            ],
            "list": [
                {
                    "token": "keyword.operator",
                    "regex": "(\\])",
                    "next": "pop"
                },
                {
                    "token": "text",
                    "regex": "(\\.\\s*)"
                },
                {
                    "token": "keyword.operator",
                    "regex": "({)",
                    "push": "nbt"
                },
                {
                    "token": "constant.numeric",
                    "regex": "(-?\\d+\\.\\.-?\\d*|\\.\\.-?\\d+|(\\^|~)?-?\\d+\\.?\\d*\\w*|\\^|~)"
                },
                {
                    "token": "constant.language.boolean",
                    "regex": "((true|false)( |$))"
                },
                {
                    "token": "string",
                    "regex": "(\")",
                    "push": "vals__1"
                },
                {
                    "token": "string",
                    "regex": "(')",
                    "push": "vals__2"
                },
                {
                    "token": "keyword.operator",
                    "regex": "(,)"
                },
                {
                    defaultToken: "text",
                }
            ],
            "main__1": [
                {
                    "token": "comment",
                    "regex": "(?!\\s*\\.)",
                    "next": "pop"
                },
                {
                    "token": "comment",
                    "regex": "(.*?$)"
                },
                {
                    defaultToken: "text",
                }
            ],
            "main__2": [
                {
                    "token": "keyword",
                    "regex": "(run( |$))",
                    "next": "pop"
                },
                {
                    "token": "keyword",
                    "regex": "((align|anchored|as|at|facing|in|positioned|rotated|if|unless|store)( |$))"
                },
                {
                    "token": "keyword.other.unit",
                    "regex": "((<|<=|=|>|>=|\\*|actionbar|add|after|all|amount|append|as|available|base|before|block|blocks|blue|bossbar|buffer|center|chest|clear|color|copy|damage|data|destroy|disable|displayname|distance|empty|enable|enabled|entity|everything|eyes|facing|feet|filtered|first|fish|flush|force|from|function|get|give|grant|green|head|hearts|hollow|insert|integer|ips|join|keep|kill|last|leave|legs|levels|list|loot|mainhand|masked|matches|max|merge|mine|modifier|modify|move|multiply|multiply_base|name|normal|notched_10|notched_12|notched_20|notched_6|objectives|off|offhand|on|only|operation|outline|pink|players|points|predicate|prepend|progress|purple|query|rain|red|reload|remove|rendertype|replace|report|reset|result|revoke|score|set|setdisplay|spawn|start|stop|storage|style|subtitle|success|take|through|thunder|time|times|title|under|until|uuids|value|visible|warning|white|yellow)( |$))"
                },
                {
                    "token": "support.class",
                    "regex": "(@\\w+)",
                    "push": "args__1"
                },
                {
                    "token": "constant.character",
                    "regex": "(#?\\w+:[\\w/]+( |$))"
                },
                {
                    "token": "support.function",
                    "regex": "(\\.( |$))"
                },
                {
                    "token": "text",
                    "regex": "(\\.\\s*)"
                },
                {
                    "token": "keyword.operator",
                    "regex": "({)",
                    "push": "nbt"
                },
                {
                    "token": "constant.numeric",
                    "regex": "(-?\\d+\\.\\.-?\\d*|\\.\\.-?\\d+|(\\^|~)?-?\\d+\\.?\\d*\\w*|\\^|~)"
                },
                {
                    "token": "constant.language.boolean",
                    "regex": "((true|false)( |$))"
                },
                {
                    "token": "string",
                    "regex": "(\")",
                    "push": "vals__1"
                },
                {
                    "token": "string",
                    "regex": "(')",
                    "push": "vals__2"
                },
                {
                    "token": "text",
                    "regex": "(.*?( |$))"
                },
                {
                    defaultToken: "text",
                }
            ],
            "main__3": [
                {
                    "token": "comment",
                    "regex": "(^(?=.{0,1})(?:|))",
                    "next": "pop"
                },
                {
                    "token": "keyword.other.unit",
                    "regex": "((<|<=|=|>|>=|\\*|actionbar|add|after|all|amount|append|as|available|base|before|block|blocks|blue|bossbar|buffer|center|chest|clear|color|copy|damage|data|destroy|disable|displayname|distance|empty|enable|enabled|entity|everything|eyes|facing|feet|filtered|first|fish|flush|force|from|function|get|give|grant|green|head|hearts|hollow|insert|integer|ips|join|keep|kill|last|leave|legs|levels|list|loot|mainhand|masked|matches|max|merge|mine|modifier|modify|move|multiply|multiply_base|name|normal|notched_10|notched_12|notched_20|notched_6|objectives|off|offhand|on|only|operation|outline|pink|players|points|predicate|prepend|progress|purple|query|rain|red|reload|remove|rendertype|replace|report|reset|result|revoke|score|set|setdisplay|spawn|start|stop|storage|style|subtitle|success|take|through|thunder|time|times|title|under|until|uuids|value|visible|warning|white|yellow)( |$))"
                },
                {
                    "token": "support.class",
                    "regex": "(@\\w+)",
                    "push": "args__1"
                },
                {
                    "token": "constant.character",
                    "regex": "(#?\\w+:[\\w/]+( |$))"
                },
                {
                    "token": "support.function",
                    "regex": "(\\.( |$))"
                },
                {
                    "token": "text",
                    "regex": "(\\.\\s*)"
                },
                {
                    "token": "keyword.operator",
                    "regex": "({)",
                    "push": "nbt"
                },
                {
                    "token": "constant.numeric",
                    "regex": "(-?\\d+\\.\\.-?\\d*|\\.\\.-?\\d+|(\\^|~)?-?\\d+\\.?\\d*\\w*|\\^|~)"
                },
                {
                    "token": "constant.language.boolean",
                    "regex": "((true|false)( |$))"
                },
                {
                    "token": "string",
                    "regex": "(\")",
                    "push": "vals__1"
                },
                {
                    "token": "string",
                    "regex": "(')",
                    "push": "vals__2"
                },
                {
                    "token": "text",
                    "regex": "(.*?( |$))"
                },
                {
                    defaultToken: "text",
                }
            ],
            "main__4": [
                {
                    "token": "comment",
                    "regex": "(^(?=.{0,1})(?:|))",
                    "next": "pop"
                },
                {
                    "token": "entity.name.function",
                    "regex": "(.*?( |$))"
                },
                {
                    defaultToken: "text",
                }
            ],
            "main__5": [
                {
                    "token": "comment",
                    "regex": "(^(?=.{0,1})(?:|))",
                    "next": "pop"
                },
                {
                    "token": "text",
                    "regex": "(.*?$)"
                },
                {
                    defaultToken: "text",
                }
            ],
            "main__6": [
                {
                    "token": "comment",
                    "regex": "(^(?=.{0,1})(?:|))",
                    "next": "pop"
                },
                {
                    "token": "keyword.other.unit",
                    "regex": "((<|<=|=|>|>=|\\*|actionbar|add|after|all|amount|append|as|available|base|before|block|blocks|blue|bossbar|buffer|center|chest|clear|color|copy|damage|data|destroy|disable|displayname|distance|empty|enable|enabled|entity|everything|eyes|facing|feet|filtered|first|fish|flush|force|from|function|get|give|grant|green|head|hearts|hollow|insert|integer|ips|join|keep|kill|last|leave|legs|levels|list|loot|mainhand|masked|matches|max|merge|mine|modifier|modify|move|multiply|multiply_base|name|normal|notched_10|notched_12|notched_20|notched_6|objectives|off|offhand|on|only|operation|outline|pink|players|points|predicate|prepend|progress|purple|query|rain|red|reload|remove|rendertype|replace|report|reset|result|revoke|score|set|setdisplay|spawn|start|stop|storage|style|subtitle|success|take|through|thunder|time|times|title|under|until|uuids|value|visible|warning|white|yellow)( |$))"
                },
                {
                    "token": "support.class",
                    "regex": "(@\\w+)",
                    "push": "args__1"
                },
                {
                    "token": "constant.character",
                    "regex": "(#?\\w+:[\\w/]+( |$))"
                },
                {
                    "token": "support.function",
                    "regex": "(\\.( |$))"
                },
                {
                    "token": "text",
                    "regex": "(\\.\\s*)"
                },
                {
                    "token": "keyword.operator",
                    "regex": "({)",
                    "push": "nbt"
                },
                {
                    "token": "constant.numeric",
                    "regex": "(-?\\d+\\.\\.-?\\d*|\\.\\.-?\\d+|(\\^|~)?-?\\d+\\.?\\d*\\w*|\\^|~)"
                },
                {
                    "token": "constant.language.boolean",
                    "regex": "((true|false)( |$))"
                },
                {
                    "token": "string",
                    "regex": "(\")",
                    "push": "vals__1"
                },
                {
                    "token": "string",
                    "regex": "(')",
                    "push": "vals__2"
                },
                {
                    "token": "text",
                    "regex": "(.*?( |$))"
                },
                {
                    defaultToken: "text",
                }
            ],
            "nbt": [
                {
                    "token": "keyword.operator",
                    "regex": "(})",
                    "next": "pop"
                },
                {
                    "token": "variable.parameter",
                    "regex": "(\\s*\\w+\\s*(?=:))",
                    "push": "nbt__1"
                },
                {
                    defaultToken: "text",
                }
            ],
            "nbt__1": [
                {
                    "token": "keyword.operator",
                    "regex": "(,|(?=\\}))",
                    "next": "pop"
                },
                {
                    "token": "keyword.operator",
                    "regex": "(:)"
                },
                {
                    "token": "text",
                    "regex": "(\\.\\s*)"
                },
                {
                    "token": "keyword.operator",
                    "regex": "({)",
                    "push": "nbt"
                },
                {
                    "token": "constant.numeric",
                    "regex": "(-?\\d+\\.\\.-?\\d*|\\.\\.-?\\d+|(\\^|~)?-?\\d+\\.?\\d*\\w*|\\^|~)"
                },
                {
                    "token": "constant.language.boolean",
                    "regex": "((true|false)( |$))"
                },
                {
                    "token": "string",
                    "regex": "(\")",
                    "push": "vals__1"
                },
                {
                    "token": "string",
                    "regex": "(')",
                    "push": "vals__2"
                },
                {
                    "token": "keyword.operator",
                    "regex": "(\\[(\\w;)?)",
                    "push": "list"
                },
                {
                    defaultToken: "text",
                }
            ],
            "scores_inside": [
                {
                    "token": "keyword.operator",
                    "regex": "(})",
                    "next": "pop"
                },
                {
                    "token": "variable.parameter",
                    "regex": "(\\s*\\w+\\s*(?==!?\\s*))",
                    "push": "scores_inside__1"
                },
                {
                    defaultToken: "text",
                }
            ],
            "scores_inside__1": [
                {
                    "token": "keyword.operator",
                    "regex": "(,|(?=\\}))",
                    "next": "pop"
                },
                {
                    "token": "keyword.operator",
                    "regex": "(=!?\\s*)"
                },
                {
                    "token": "constant.numeric",
                    "regex": "(-?\\d+\\.\\.-?\\d*|\\.\\.-?\\d+|-?\\d+)"
                },
                {
                    "token": "text",
                    "regex": "(\\.\\s*)"
                },
                {
                    "token": "invalid.illegal",
                    "regex": "([^,\\[\\]\\{\\}]+)"
                },
                {
                    defaultToken: "text",
                }
            ],
            "selector_inside": [
                {
                    "token": "support.class",
                    "regex": "(\\])",
                    "next": "pop"
                },
                {
                    "token": "variable.parameter",
                    "regex": "(\\s*scores\\s*(?==!?\\s*))",
                    "push": "selector_inside__1"
                },
                {
                    "token": "variable.parameter",
                    "regex": "(\\s*\\w+\\s*(?==!?\\s*))",
                    "push": "selector_inside__2"
                },
                {
                    defaultToken: "text",
                }
            ],
            "selector_inside__1": [
                {
                    "token": "keyword.operator",
                    "regex": "(,|(?=\\]))",
                    "next": "pop"
                },
                {
                    "token": "keyword.operator",
                    "regex": "(=!?\\s*)"
                },
                {
                    "token": "keyword.operator",
                    "regex": "({)",
                    "push": "scores_inside"
                },
                {
                    "token": "text",
                    "regex": "(\\.\\s*)"
                },
                {
                    "token": "invalid.illegal",
                    "regex": "([^,\\[\\]\\{\\}]+)"
                },
                {
                    defaultToken: "text",
                }
            ],
            "selector_inside__2": [
                {
                    "token": "keyword.operator",
                    "regex": "(,|(?=\\]))",
                    "next": "pop"
                },
                {
                    "token": "keyword.operator",
                    "regex": "(=!?\\s*)"
                },
                {
                    "token": "text",
                    "regex": "(\\.\\s*)"
                },
                {
                    "token": "keyword.operator",
                    "regex": "({)",
                    "push": "nbt"
                },
                {
                    "token": "constant.numeric",
                    "regex": "(-?\\d+\\.\\.-?\\d*|\\.\\.-?\\d+|(\\^|~)?-?\\d+\\.?\\d*\\w*|\\^|~)"
                },
                {
                    "token": "constant.language.boolean",
                    "regex": "((true|false)( |$))"
                },
                {
                    "token": "string",
                    "regex": "(\")",
                    "push": "vals__1"
                },
                {
                    "token": "string",
                    "regex": "(')",
                    "push": "vals__2"
                },
                {
                    "token": "constant.character",
                    "regex": "([^, \\[\\]\\{\\}]+)"
                },
                {
                    defaultToken: "text",
                }
            ],
            "vals__1": [
                {
                    "token": "string",
                    "regex": "(\")",
                    "next": "pop"
                },
                {
                    "token": "string",
                    "regex": "(\\\\(?:\\\\|\"))"
                },
                {
                    "token": "string",
                    "regex": "([^\"\\\\]+)"
                },
                {
                    defaultToken: "text",
                }
            ],
            "vals__2": [
                {
                    "token": "string",
                    "regex": "(')",
                    "next": "pop"
                },
                {
                    "token": "string",
                    "regex": "(\\\\(?:\\\\|'))"
                },
                {
                    "token": "string",
                    "regex": "([^'\\\\]+)"
                },
                {
                    defaultToken: "text",
                }
            ]
        };
        this.normalizeRules();
    };

    oop.inherits(CustomHighlightRules, TextHighlightRules);

    exports.CustomHighlightRules = CustomHighlightRules;
});