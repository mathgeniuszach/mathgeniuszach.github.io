// Some functions here whose job it is to screw async.
// They make sure the user doesn't touch anything while data is being loaded.
var page_blockers = 0;
var func = null;
function block(count=1, f) {
    $("#page-blocker").removeClass("nodisplay");
    page_blockers += count;
    if (f) func = f;
};
function unblock(count=1) {
    page_blockers -= count;
    if (page_blockers <= 0) {
        $("#page-blocker").addClass("nodisplay");
        page_blockers = 0;
        
        if (func) {
            func();
            func = null;
        }
    }
};

function swapNodes(a, b) {
    var aparent = a.parentNode;
    var asibling = a.nextSibling === b ? a : a.nextSibling;
    b.parentNode.insertBefore(a, b);
    aparent.insertBefore(b, asibling);
}

function setupAce(elem, mode) {
    var editor = ace.edit(elem);
    //rawEditor.setTheme("ace/theme/monokai");
    editor.session.setMode(mode);
    editor.setShowPrintMargin(false);
    $("#"+elem).mouseup(function(e) {editor.resize()});
    return editor;
}

// Function to insert an element in a specific part of a dictionary
function insertIn(map, pos, key, e) {
    var keys = Object.keys(map);
    if (pos < 0 || pos > keys.length) throw Error("position is outside the map length");

    // Start by putting the element at the end of the map
    map[key] = e;

    // Now move everything that should be beneath that key under that key
    // This works by re-entering those elements into the object.
    for (let i = pos; i < keys.length; i++) {
        let temp = map[keys[i]];
        delete map[keys[i]];
        map[keys[i]] = temp;
    }
}

// Function to push down an element one position in a specific part of a dictionary
// Pushing down is easier than pushing up.
function pushDownIn(map, pos) {
    var keys = Object.keys(map);
    if (pos < 0 || pos > keys.length-2) throw Error("position index cannot be pushed down in the map");

    // Start by moving the element to the end of the map
    var temp = map[keys[pos]];
    delete map[keys[pos]];
    map[keys[pos]] = temp;

    // Then move everything that should be under the key under that key.
    for (let i = pos+2; i < keys.length; i++) {
        let temp = map[keys[i]];
        delete map[keys[i]];
        map[keys[i]] = temp;
    }
}

function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    
    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);
        
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                    )|0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
            
            hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
    
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

$(document).ready(function() {
    $("header").load("/snips/header.html");
    $("footer").load("/snips/footer.html");
});