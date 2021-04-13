
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
                    "regex": "(\\s*#.*?$)"
                },
                {
                    "token": "support.function.dom",
                    "regex": "(\\s*execute( |$))",
                    "push": "main__1"
                },
                {
                    "token": "support.type",
                    "regex": "(\\s*(scoreboard|data)( |$))",
                    "push": "main__2"
                },
                {
                    "token": "support.function",
                    "regex": "(\\s*.*?( |$))",
                    "push": "main__3"
                },
                {
                    defaultToken: "text",
                }
            ],
            "main__1": [
                {
                    "token": "keyword",
                    "regex": "(run |$)",
                    "next": "pop"
                },
                {
                    "token": "keyword",
                    "regex": "(align|anchored|as|at|facing|in|positioned|rotated|if|unless|store)"
                },
                {
                    "token": "constant.numeric",
                    "regex": "((((\\.\\.|~|\\^)?-?\\d*?\\.?\\d+\\w*(\\.\\.)?)|~|\\^)( |$))"
                },
                {
                    "token": "constant.language.boolean",
                    "regex": "((true|false)( |$))"
                },
                {
                    "token": "keyword.operator",
                    "regex": "((<|<=|=|>|>=|\\*|actionbar|add|after|all|amount|append|as|available|base|before|block|blocks|blue|bossbar|buffer|center|chest|clear|color|copy|damage|data|destroy|disable|displayname|distance|empty|enable|enabled|entity|everything|eyes|facing|feet|filtered|first|fish|flush|force|from|function|get|give|grant|green|head|hearts|hollow|insert|integer|ips|join|keep|kill|last|leave|legs|levels|list|loot|mainhand|masked|matches|max|merge|mine|modifier|modify|move|multiply|multiply_base|name|normal|notched_10|notched_12|notched_20|notched_6|objectives|off|offhand|on|only|operation|outline|pink|players|points|predicate|prepend|progress|purple|query|rain|red|reload|remove|rendertype|replace|report|reset|result|revoke|score|set|setdisplay|spawn|start|stop|storage|style|subtitle|success|take|through|thunder|time|times|title|under|until|uuids|value|visible|warning|white|yellow)( |$))"
                },
                {
                    "token": "constant.character",
                    "regex": "(#?\\w+:[\\w/]+( |$))"
                },
                {
                    "token": "text",
                    "regex": "(.*?( |$))"
                },
                {
                    defaultToken: "text",
                }
            ],
            "main__2": [
                {
                    "token": "comment",
                    "regex": "(^(?=.{0,1})(?:|))",
                    "next": "pop"
                },
                {
                    "token": "constant.numeric",
                    "regex": "((((\\.\\.|~|\\^)?-?\\d*?\\.?\\d+\\w*(\\.\\.)?)|~|\\^)( |$))"
                },
                {
                    "token": "constant.language.boolean",
                    "regex": "((true|false)( |$))"
                },
                {
                    "token": "keyword.operator",
                    "regex": "((<|<=|=|>|>=|\\*|actionbar|add|after|all|amount|append|as|available|base|before|block|blocks|blue|bossbar|buffer|center|chest|clear|color|copy|damage|data|destroy|disable|displayname|distance|empty|enable|enabled|entity|everything|eyes|facing|feet|filtered|first|fish|flush|force|from|function|get|give|grant|green|head|hearts|hollow|insert|integer|ips|join|keep|kill|last|leave|legs|levels|list|loot|mainhand|masked|matches|max|merge|mine|modifier|modify|move|multiply|multiply_base|name|normal|notched_10|notched_12|notched_20|notched_6|objectives|off|offhand|on|only|operation|outline|pink|players|points|predicate|prepend|progress|purple|query|rain|red|reload|remove|rendertype|replace|report|reset|result|revoke|score|set|setdisplay|spawn|start|stop|storage|style|subtitle|success|take|through|thunder|time|times|title|under|until|uuids|value|visible|warning|white|yellow)( |$))"
                },
                {
                    "token": "constant.character",
                    "regex": "(#?\\w+:[\\w/]+( |$))"
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
                    "token": "constant.numeric",
                    "regex": "((((\\.\\.|~|\\^)?-?\\d*?\\.?\\d+\\w*(\\.\\.)?)|~|\\^)( |$))"
                },
                {
                    "token": "constant.language.boolean",
                    "regex": "((true|false)( |$))"
                },
                {
                    "token": "keyword.operator",
                    "regex": "((<|<=|=|>|>=|\\*|actionbar|add|after|all|amount|append|as|available|base|before|block|blocks|blue|bossbar|buffer|center|chest|clear|color|copy|damage|data|destroy|disable|displayname|distance|empty|enable|enabled|entity|everything|eyes|facing|feet|filtered|first|fish|flush|force|from|function|get|give|grant|green|head|hearts|hollow|insert|integer|ips|join|keep|kill|last|leave|legs|levels|list|loot|mainhand|masked|matches|max|merge|mine|modifier|modify|move|multiply|multiply_base|name|normal|notched_10|notched_12|notched_20|notched_6|objectives|off|offhand|on|only|operation|outline|pink|players|points|predicate|prepend|progress|purple|query|rain|red|reload|remove|rendertype|replace|report|reset|result|revoke|score|set|setdisplay|spawn|start|stop|storage|style|subtitle|success|take|through|thunder|time|times|title|under|until|uuids|value|visible|warning|white|yellow)( |$))"
                },
                {
                    "token": "constant.character",
                    "regex": "(#?\\w+:[\\w/]+( |$))"
                },
                {
                    "token": "text",
                    "regex": "(.*?( |$))"
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