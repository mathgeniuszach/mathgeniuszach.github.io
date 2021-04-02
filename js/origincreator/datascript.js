// Datascript specification
var specRaw;
var spec;
$.get('/js/origincreator/datascript.pegjs', function(data) {
    specRaw = data;
});

function resetCompilation() {

}

// Preprocessor
function processScript(script) {
    var tscript = script.replace(/\r\n|\r/g, "\n").replace("\\\n", "")+"\n";
    return tscript;
}
// Parser
function parseScript(script) {
    // If this is the first time compiling, generate spec
    if (!spec) spec = peg.generate(specRaw);

    // Parser
    var astp = new asty();
    return pegutil.parse(spec, script, {
        "startRule": "start",
        "makeAST": function (line, column, offset, args) {
            return astp.create.apply(astp, args).pos(line, column, offset);
        }
    });
}
// Compiler
function compileAst(ast) {
    
}
function* genFile(ast) {

}


function dumpScript(script) {
    resetCompilation();
    var processed = processScript(script);
    var ast = parseScript(processed);

    var e = ast.error;
    if (e) {
        return `ERROR: line ${e.line}, col ${e.column}: ${e.message}`;
    } else {
        return ast.ast.dump();
    }
}
function compileScript(script) {
    resetCompilation();
    var processed = processScript(script);
    var ast = parseScript(processed);

    var e = ast.error;
    if (e) {
        // Do something with error
        return `ERROR: line ${e.line}, col ${e.column}: ${e.message}`;
    } else {
        compileAst(ast.ast);
    }
}