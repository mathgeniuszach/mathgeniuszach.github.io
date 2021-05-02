// Initialize ast generator
{
    const unroll = options.util.makeUnroll(location, options);
    const ast = options.util.makeAST(location, options);
    
    function ierror(text) {
        const loc = location();
        error(text, {start: loc.end, end: loc.end});
    }
}

// Starting location
start
    = tokens:token* {
        return ast("Block").add(tokens);
    }

token
    = _? "." {
        expected("command");
    }
    / _? "\n" {
        return ast("Blank");
    }
    / _? "#" _? sline:$([^\n]*) slines:("\n" _? "." _? $([^\n]*))* {
        console.log(slines);
        const data = unroll(sline, slines, 4).join(" ");
        return ast("Comment").set("data", data);
    }
    / _? "/"? _? cmd:$[^ \t\n]+ _ sline:args? slines:("\n" _? "." _? args)* "\n" {
        const node = ast("Command").set("name", cmd);
        const lines = unroll(sline, slines, 4);

        if (lines.length) {
            node.set("data", lines.join(" "));
        } else {
            node.set("data", "");
        }

        return node;
    }

args
    = $((
        ([^{\n]+ / "{" !"\n")+
        / "{" (!"\n}" .)+ "\n}"
        / "\n" _? "." _?
    )+)

_ "blank" = [ \t]+

// The code auto-replaces \r\n and \r with \n, so eol is just \n
eol = "\n"
___ "separator" = (_ / eol)+