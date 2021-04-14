// Starting location
start
    = tokens:token* {
        return ast("Block").add(tokens);
    }

token
    = " "