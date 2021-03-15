// Initialize ast generator
{
    var unroll = options.util.makeUnroll(location, options);
    var ast = options.util.makeAST(location, options);
    
    var eRegExp = RegExp(/^\s+$/g);
    var spos = RegExp(/[\d~^\-]/g);
    
    function ierror(text) {
        var loc = location();
        error(text, {start: loc.end, end: loc.end});
    }
    
    function clean(l) {
        if (Array.isArray(l)) {
            for (let i = l.length-1; i >= 0; i--) {
                if (typeof(l[i]) == "string") {
                    if (l[i][0] == "(" && l[i][l[i].length-1] == ")") {
                        l[i] = l[i].substring(1, l[i].length-1);
                    }
                    if (eRegExp.test(l[i])) {
                        l.splice(i, 1);
                    }
                }
            }
        } else {
            throw Error("Not an array to clean!");
        }
        return l;
    }
}

// Starting location. It just gets a list of tokens.
start
    = tokens:token* {
        return ast("Block").add(tokens);
    }

// Tokens are just abstract lines of code for the compiler to utilize.
token "token"
    = _? eol { return ast("Blank"); }
    / _? c:$("#"+ " " (!eol .)*) eol {
        return ast("Comment").set("data", c);
    }
    / _? "##" md:mdirective? eol {
        if (!md) expected("multiline directive");
        return md;
    }
    / _? "#" d:directive? eol {
        if (!d) expected("directive");
        return d;
    }
    / _? "{" ___? block:start ___? e:"}"? ___? {
        if (!e) ierror("Expected end of block");
        return block;
    }
    / ___? ms:(marker ___?)+ {
        return ast("MChain").add(unroll(null, ms, 0));
    }
    / _? "var" _ v:tvar _? type:$([a-zA-Z.:_\-]+)? ex:(_? "=" _? expr)? _? eol? {
        if (ex) v.add(ex[3]);
        v.set("init", true).set("type", type || "dummy");
        return v;
    }
    / _? v:tvar _? "=" _? ex:expr? _? eol? {
        if (!ex) ierror("Expected proper expression for variable assignment")
        v.add(ex);
        v.set("init", false);
        return v;
    }
    / _? v:tvar _? "><" _? v2:tvar _? eol? {
        return ast("Swap").add(v).add(v2);
    }
    / _? p:print _? eol? {
        return p;
    }
    / _? f:func _? eol? {
        return f;
    }
    / _? "after" _ t:$(number "d" / "s" / "t" / "") replace:"r"? {
        return ast("After").set("t", t).set("replace", replace == "r");
    }
    / _? "/" c:command _? eol? {
        return c;
    }

// Multi directives are directives that span multiple lines, ending on ##.
mdirective "multiline directive"
    = name:id args:(_ arg)* &(eol) data:$(!dirend .)* end:dirend? {
        if (!end) ierror("Expected end of multiline directive");
        return ast("MDirective").
            set("name", name).
            set("args", clean(unroll(null, args, 1))).
            set("data", data.trim());
    }

dirend "##" = eol _? "##"

// Directives are simple instructions for the compiler that don't get turned into commands.
directive "directive"
    = name:id args:(_ arg)* {
        return ast("Directive").
            set("name", name).
            set("args", clean(unroll(null, args, 1)));
    }

// Markers "mark" either a single command or block of code to run or generate under certain conditions.
marker "marker"
    // Free markers
    = "if" ___ cond:cond? e:":"? {
        if (!cond) ierror("Expected complete condition");
        if (!e) ierror("Expected semicolon to end if marker");
        return ast("If").add(cond);
    }
    / "unless" ___ cond:cond? e:":"? {
        if (!cond) ierror("Expected complete condition");
        if (!e) ierror("Expected semicolon to end unless marker");
        return ast("Unless").add(cond);
    }
    / "else" e:":"? {
        return ast("Else");
    }
    / "asat" ___ target:selector? e:":"? {
        if (!target) ierror("Expected target for asat marker");
        return ast("AsAt").set("target", target);
    }
    / "as" ___ target:selector? e:":"? {
        if (!target) ierror("Expected target for as marker");
        return ast("As").set("target", target);
    }
    / "at" ___ target:selector? e:":"? {
        if (!target) ierror("Expected target for at marker");
        return ast("At").set("target", target);
    }
    / "facing" ___ target:$(pos / selector ___ ("eyes" / "feet"))? e:":"? {
        if (!target) ierror("Expected position or target for facing marker");
        return ast("Facing").set("target", target).set("entity", !spos.test(target[0]));
    }
    / "in" ___ dimension:nid? e:":"? {
        if (!target) ierror("Expected dimension for in marker");
        return ast("In").set("dimension", dimension);
    }
    / "positioned" ___ target:$(pos / selector)? e:":"? {
        if (!target) ierror("Expected position or target for positioned marker");
        return ast("Positioned").set("target", target).set("entity", !spos.test(target[0]));
    }
    / "rotated" ___ target:$(float float / selector)? e:":"? {
        if (!target) ierror("Expected rotation or target for rotated marker");
        return ast("Positioned").set("target", target).set("entity", !spos.test(target[0]));
    }
    / "align" ___ axes:id? e:":"? {
        if (!axes) ierror("Expected axes for align marker");
        return ast("Align").set("axes", axes);
    }
    / "anchored" ___ loc:("eyes" / "feet")? e:":"? {
        if (!loc) ierror("Expected 'eyes' or 'feet' for anchored marker location");
        return ast("Anchored").set("loc", loc);
    }
    // Block markers
    / "def" ___ id:mnid? e:":"? {
        // Name a function and prevent the function from auto-running
        if (!id) ierror("Expected namespaced id for block of code name");
        return ast("Def").set("id", id);
    }
    / "id" ___ id:mnid? e:":"? {
        // Same as def, but doesn't prevent function from auto-running
        if (!id) ierror("Expected namespaced id for block of code name");
        return ast("Id").set("id", id);
    }
    / "namespace" ___ id:id? e:":"? {
        if (!id) ierror("Expected namespaced id for block of code namespace");
        return ast("Namespace").set("id", id);
    }
    / "folder" ___ id:id? ids:("/" id)* e:":"? {
        if (!id) ierror("Expected namespaced id for block of code folder");
        return ast("Folder").set("folders", unroll(id, ids, 1));
    }
    / "inl" e:":"? {
        // Inline says to not generate this block as a function
        return ast("Inline");
    }

// Function calls are neat! They allow for easy arguments, nesting, and return values not possible with the function command.
func "function"
    = id:mnid "(" ___? a:expr? b:(___? "," ___? expr)* ")" {
        var astv = ast("Function").set("id", id);

        var v = unroll(a, b, 3);
        if (v) astv.add(v);

        return astv;
    }

print "print"
    = "print(" ___? s:selector? ___? ","? ___? f:string? args:(___? "," ___? (expr / ostring))* ")" {
        if (!f) ierror("Expected string for print command");
        var astv = ast("Print").set("s", s || "@a").set("f", f);

        var v = unroll(null, args, 3);
        if (v) astv.add(v);

        return astv;
    }

// Commands are minecraft commands, usually prefixed with /. You know this, right?
// The cool thing is, this implementation supports both multiline and multiple per line commands.
command "command"
    = name:id args:(_ !("/" [a-zA-Z]) arg)* {
        return ast("Command").
            set("name", name).
            set("args", clean(unroll(null, args, 2)));
    }



// These are the building blocks of higher level parsing instructions.

// Identifiers are simple, no-nonsense identifiers.
id "identifier" = $([a-zA-Z_][a-zA-Z0-9_\-]*)
// Namespaced id.
nid "namespaced id" = $(id ":" (id "/")* id)
// Maybe namespaced id
mnid "namespaced id" = $(id (":" id)? ("/" id)*)
// Number!
number "number" = $("-"? [0-9]+)
float "float" = $("-"? [0-9]+ ("." [0-9]+)?)
// Coordinate
coord "coord" = $(("~" / "^")? float)
// Position
pos "position" = $(coord ___ coord ___ coord)


// Conditions are a combination of selectors, "and"s and "or"s used together to make a statement.
// They do not need to be surrounded by parentheses, but they can be.
cond "condition"
    = cs:(___? (
      orcond
      / andcond
      / test
    ))+ {
        return ast("Condition").add(unroll(null, cs, 1)).set("invert", false);
    }

icond = i:"!"? "(" c:cond ")" {
    if (i) c.set("invert", true);
    return c;
}

orcond = a:(andcond / test) b:(___? "|" ___? (andcond / test))+ {
    return ast("Or").add(a).add(unroll(null, b, 3));
}

andcond = a:test b:(___? "&" ___? test)+ {
    return ast("And").add(a).add(unroll(null, b, 3));
}

test
    = arg:(
      vartest
      / selector
      / icond
      / other
    ) {
        if (typeof(arg) == "string") {
            if (arg[0] == ":") expected("selector, variable test, or condition");
            return ast("Test").set("data", arg);
        } else {
            return arg;
        }
    }

vartest
    = a:tvar ___?
      op:$("<=" / "<" / ">=" / ">" / "==" / "=") ___?
      b:(tvar / number) ___? {
        var top = op;
        if (top == "==") top = "=";
        var tester = ast("VarTest").set("op", top).add(a);
        if (typeof(b) == "string") {
            tester.add(ast("Number").set("n", parseInt(b)));
        } else {
            tester.add(b);
        }
        return tester;
    }

tvar
    = name:id _? target:selector? {
        return ast("Var").set("name", name).set("target", target);
    }

// Expressions are a combination of commands and variables to perform arithmetic on to store into a variable.
expr "expression"
    = arg:(
      aexpr
      / mexpr
      / eop
    ) {
        return arg;
    }

iexpr = "(" c:expr ")" {
    return c;
}

aexpr = a:(mexpr / eop) b:(___? ("+" / "-") ___? (mexpr / eop))+ {
    var astv = ast("Sum").add(a);
    for (let [_0, op, _1, v] of b) {
        astv.add(v.set("op", op));
    }
    return astv;
}

mexpr = a:eop b:(___? ("*" / "/" / "%") ___? eop)+ {
    var astv = ast("Product").add(a);
    for (let [_0, op, _1, v] of b) {
        astv.add(v.set("op", op));
    }
    return astv;
}

eop
    = arg:(
      float
      / func
      / tvar
      / icommand
      / iexpr
      / other
    ) {
        if (typeof(arg) == "string") {
            if (arg[0] == ":") expected("variable, inline command, constant, or expression");
            return ast("Constant").set("value", parseInt(arg));
        } else {
            return arg;
        }
    }

icommand = "<" ___? "/"? id:id args:(_ !("/" [a-zA-Z]) iarg)* ___? ">" {
    return ast("Command").set("name", id).set("args", clean(unroll(null, args, 2)));
}

_ "blank"
    = (
        [ \t]+
        / "//" (!eol .)* eol
        / "/*" (!"*/" .)* "*/"
    )+

// The code auto-replaces \r\n and \r with \n, so eol is just \n
eol = "\n"
___ "separator" = (_ / eol)+

// Arguments are anything from simple identifiers to multiline nested monstrosities.
// I'm proud of how they turned out, honestly. The visual studio code plugin doesn't like it though
arg "argument" = $((!___ [^(){}\[\]"])+ / string / body)+
// Marker arguments are like arguments, but end when a colon or comma is found outside a body or string.
marg "argument" = $((!___ [^(){}\[\]\":,])+ / string / body)+

iarg "argument" = $((!___ [^(){}\[\]"\>])+ / string / body)+

// Other is just to catch errors.
other "argument" = arg:marg {return ":"+arg;}

// Either a player identifier or a truefound selector.
selector = $("@" [a-zA-Z] ("[" ibody "]")? / id)

string = s:$("\"" ("\\\\" / "\\\"" / [^\\"]+)*) e:"\""? {
    if (!e) ierror("Expected end of string");
    return s+e;
}
ostring = s:string {
    return ast("String").set("data", s);
}

ibody = ([^(){}\[\]"]+ / string / body)*
body
    = s:$("{" ibody) e:"}"? {
        if (!e) ierror("Expected end of body");
        return s+e;
    }
    / s:$("(" ibody) e:")"? {
        if (!e) ierror("Expected ending parenthesis");
        return s+e;
    }
    / s:$("[" ibody) e:"]"? {
        if (!e) ierror("Expected end of square body");
        return s+e;
    }