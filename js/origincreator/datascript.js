var spec;
$.get('/js/origincreator/datascript.pegjs', function(data) {
    spec = data;
});

const markers = ["if", "else"];
const re_line = RegExp(/.*?(\r|\n|\r\n|$)/g);
const re_empty = RegExp(/^\s*$/g);
const re_end = RegExp(/^#end.*?(\r|\n|\r\n|$)/mg);

function compileScript(name, context) {
    var scripts = data["data_scripts/"];
    if (scripts) {
        var script = scripts["main"];
        if (!script) script = scripts["main.mcds"];
        if (!script) script = scripts[pid+":main"];
        if (!script) script = scripts[pid+":main.mcds"];
        if (script) {
            
        }
    }
}

// This function takes a string as arguments and spits back arguments of the string (because regex doesn't support recursion)
function* genArgs(text, bPos=0) {
    var pos = bPos;
    const sep = RegExp(/[\s]*?|$/g);
    sep.lastIndex = pos;

    while (true) {
        // Get first part of argument
        let arg = "";
        let nest = 0;
        let quot = 0;

        do {
            let arg = text.substring(pos, sep.exec(text).index);
        } while (nest == 0 && quot % 2 == 0);

        // Give back argument
        yield arg;
    }
}

// Generator that returns lines of mcfunction code and calls itself recursively if need be.
function* genBlock(block, context={}) {
    // Position in the script the compiler is at.
    var pos = 0;
    var len = block.length;
    var match;

    // Previous marker, used for generating if statements
    var prevMarker;
    
    while (pos < len) {
        // Yield empty lines
        re_line.lastIndex = pos;
        let line = re_line.exec(block)[0];
        while (re_empty.test(line)) {
            yield "";
            pos += line.length;
            line = re_line.exec(block)[0];
        }
        // Split line into arguments. Arguments containing spaces will be reconstructed if need be.
        // This also means spaces are necessary to define arguments.
        let args = line.trim().split(" ");

        // Handle compiler declarations
        if (block[pos] == "#") {
            // This is a normal compiler declaration. Figure out which one it is.
            switch (args[0]) {
                case "#":
                    // In this case, the line is a residual comment. Therefore it's legacy continues on!
                    yield line.trim();
                    pos += line.length;
                    break;
                case "#js":
                    re_end.lastIndex = pos;
                    match = re_end.exec(block);
                    let code = script.substring(pos+line.length, match.index).trim();
                    try {
                        with (context) eval(code);
                    } catch (err) {
                        console.error(err);
                        yield "WARN: javascript error " + err.message;
                    }
                    break;
                default:
                    yield "ERR: unknown compiler directive '" + args[0] + "'";
                    pos + line.length;
                    break;
            }
        } else if (markers.includes(args[0])) {
            // If the identifier is a marker, this starts a marker chain.
            let marker = MarkerChain(block, pos);
            yield* marker.generate(prevMarker);
            prevMarker = marker;
            pos = marker.pos;
        } else {
            switch (args[0]) {
                //case "loop":
                //    break;
                default:
                    // The identifier must be a command, so return it as such
                    yield line.trim();
                    pos += line.length;
                    break;
            }
        }
    }
}

class MarkerChain {
    constructor(block, blockPos) {
        this.block = block;
        this.pos = blockPos;

        
    }

    * generate(prevMarker) {
        // Marker chain is what actually generates nested code.
    }
}