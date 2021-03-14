var specRaw;
var spec;
$.get('/js/origincreator/datascript.pegjs', function(data) {
    specRaw = data;
});

function createAst(script) {
    // If this is the first time compiling, generate spec
    if (!spec) spec = peg.generate(specRaw);

    var tscript = script.replace(/\r\n|\r/g, "\n")+"\n";

    var astp = new asty();
    return pegutil.parse(spec, tscript, {
        "startRule": "start",
        "makeAST": function (line, column, offset, args) {
            return astp.create.apply(astp, args).pos(line, column, offset);
        }
    });
}

function dumpAst(ast) {
    var e = ast.error;
    if (e) {
        console.log(e);
        console.error(`line ${e.line}, col ${e.column}: ${e.message}`);
    } else {
        return ast.ast.dump();
    }
}