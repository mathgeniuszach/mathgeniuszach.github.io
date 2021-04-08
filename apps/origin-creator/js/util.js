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

var aceQueue = [];
function setupAce(elem, mode) {
    var editor = ace.edit(elem);
    //editor.setTheme("ace/theme/monokai");
    editor.session.setMode(mode);
    editor.setShowPrintMargin(false);
    $("#"+elem).mouseup(function(e) {editor.resize()});
    return editor;
}
function setupAces() {
    for (let [elem, mode] of aceQueue) setupAce(elem, mode);
    aceQueue = [];
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