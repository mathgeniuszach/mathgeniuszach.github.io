{
    var unroll = options.util.makeUnroll(location, options)
    var ast    = options.util.makeAST(location, options)
}

start
    = lines:line* {
        return ast("Block").add(lines);
    }

line
    = lco
    / _ eol {
        return ast("Blank");
    }
    / directive

directive
    = _ "#" name:([a-zA-Z_][a-zA-Z0-9_]*) args:(arg*) eol {
        return ast("Directive").
            set("name", name).
            set("args", args);
    }

larg "inline_argument"
    = [a-zA-Z_][a-zA-Z0-9_]*

marg "marker_argument"
    = [a-zA-Z_][a-zA-Z0-9_]*



_ "blank"
    = (bco / ws)*

eol
    = "\r" / "\n" / "\r\n"
lco "line_comment"
    = "//" (!eol .)* eol
bco "block_comment"
    = "/*" (!"*/" .)* "*/"
ws "whitespace"
    = [ \t]*

