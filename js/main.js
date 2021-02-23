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

$(document).ready(function() {
    $("header").load("/snips/header.html");
    $("footer").load("/snips/footer.html");
});