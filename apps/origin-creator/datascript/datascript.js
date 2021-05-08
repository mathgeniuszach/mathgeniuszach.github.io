// Datascript specification
var extfunc;
var cmdargs;
$.get('datascript/extfunc.pegjs', function (data) {
    extfunc = peg.generate(data);
});
$.get('datascript/cmdargs.pegjs', function (data) {
    cmdargs = peg.generate(data);
})

var context;
var contextCmds;
var contextExecs;
var dataFolder;

/*
    s: string/single argument (also for selectors or other things)
    e: expression (ends with a "{" (not captured for m arg) or a newline marker)
    i: integer
    n: number
    b: boolean (true/false)
    m: multiline (text inside braces {})
    _: unknown argument, guessed by type

    t: text (works like the say command)
    +: all (an unknown number of other arguments, inferenced from context)

    t and + must be at the end.
    you can also use "?" after any argument to make it optional; does not work with t and +
    combining simple arguments together is also possible: "mb" is multiline or boolean. "_" is the same as "sinbm". You cannot combine e, t, or + with anything else.
*/
function parseArgs(argString, format="t") {
    // Default argument means just return back
    if (format == "t") return argString;


}
function regCommand(name, format, func) {
    contextCmds[name] = {
        format: format,
        func: func
    };
}
function resetContext(dFolder) {
    dataFolder = dFolder;
    contextCmds = {};

    context = vm.createContext({
        parseArgs: parseArgs,
        regCommand: regCommand
    });

    // Alias for objective creation.
    regCommand("var", "s s? s?", function (name, type="dummy", displayName="") {
        return `scoreboard objectives add ${name} ${type} ${displayName}`;
    });
    // Alias for objective removal.
    regCommand("del", "s", function (name) {
        return `scoreboard objectives remove ${name}`;
    });
    // Alias for clear maxCount=0
    regCommand("count", "s s", function (target, item) {
        return `clear ${target} ${item} 0`;
    });

    // // Alias for multi-command generation of complex expressions.
    // regCommand("eval", "s s e", function (target, name, op, exprCmds) {

    // });
    // // Alias for multi-command generation of complex conditions. Also supports else.
    // regCommand("if", "e m s? m?", function (args) {

    // });
}

// Preprocessor
function processScript(script) {
    // Split lines
    let f = script.split(/\r?\n|\r/g);
    // Trim each line
    for (let i = 0; i < f.length; i++) {
        f[i] = f[i].trim();
    }
    // Join lines back together
    f = f.join("\n")+"\n";

    // Find JS macros
    f.replace(/%{(.*?)}%/gs, (_, code) => {
        return vm.runInContext(code, context) || "";
    });

    return f;
}
// Parser
function parseScript(script) {
    if (!extfunc || !cmdargs) throw Error("Parser not loaded yet. Wait a few seconds and try again.");

    // Parser
    let astp = new ASTY();
    return PEGUtil.parse(extfunc, script, {
        "startRule": "start",
        "makeAST": function (line, column, offset, args) {
            return astp.create.apply(astp, args).pos(line, column, offset);
        }
    });
}
// Compiler
function compileAst(ast, id) {

}

// Functions for generating files in the zip, based on extfunc code
function genFile(id, content, ext=".json") {
    dataFolder.file(id.replace(/:/g, "/") + ext, content);
}
function genScript(id, code) {
    const content = compileAst(parseScript(processScript(code)), id);
    genFile(id, content, ".mcfunction");
}


function dumpScript(script) {
    var processed = processScript(script);
    var ast = parseScript(processed);

    var e = ast.error;
    if (e) {
        return `ERROR: line ${e.line}, col ${e.column}: ${e.message}`;
    } else {
        return ast.ast.dump();
    }
}
// function compileScript(script) {
//     resetCompilation();
//     var processed = processScript(script);
//     var ast = parseScript(processed);

//     var e = ast.error;
//     if (e) {
//         // Do something with error
//         return `ERROR: line ${e.line}, col ${e.column}: ${e.message}`;
//     } else {
//         compileAst(ast.ast);
//     }
// }