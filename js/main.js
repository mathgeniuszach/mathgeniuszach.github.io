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