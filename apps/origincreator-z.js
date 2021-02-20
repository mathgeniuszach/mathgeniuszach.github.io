function addListItem(btn) {
    var pnl = $(btn.parentElement);
    var lbtn = $(btn);
    
    var level = parseInt(lbtn.attr("level"));
    var cs = "panel";
    if (level % 2 == 1) {
        cs = "panel panel-dark";
    }
    
    var i = pnl.find(">.panel").length;
    
    lbtn.before(`<div name="${i}" class="${cs} m _${i}"><button class="mb zlist-button" onclick="copyListItem(this)">+</button><button class="mb zlist-button" onclick="removeListItem(this)">-</button><button class="mb zlist-button" onclick="listItemUp(this)">˄</button><button class="mb zlist-button" onclick="listItemDown(this)">˅</button><br></div><br>`);
    var ipanel = pnl.find(">._"+i);
    
    var iID = getPath(btn) + "--" + i;
    insertForm(ipanel, "", locateForm(iID), iID, level+1);
    
    // Find data location to create item (javascript is very nice at this)
    locateData(iID);
    
    // Don't forget to save!
    save();
}
function clearList(btn, itemID) {
    // Clear html
    var jqb = $(btn);
    var list = jqb.parent();
    list.children("div,br").remove();
    jqb.prev().before("<br>");
    
    // Clear data
    locateData(getPath(btn.parentElement))[itemID] = [];
    
    // Don't forget to save!
    save();
}

function copyListItem(btn) {
    var pnl = $(btn.parentElement);
    
    // Get panel data
    var pnlp = pnl.parent();
    var i = parseInt(pnl.attr("name"));
    
    // Copy item in data array
    var list = locateData(getPath(btn.parentElement));
    list.splice(i, 0, JSON.parse(JSON.stringify(list[i]))); // Javascript lacks deep cloning, but this'll do since I'm not doing anything special.
    
    // Clone element (and <br>)
    var clone = pnl.clone().insertAfter(pnl);
    clone.before("<br>");
    
    // Move all elements below down one (This is why the rewrite was required)
    var elems = pnlp.find(">div");
    for (let j = i+1; j < elems.length; j++) {
        let jelem = $(elems[j]);
        jelem.attr("name", String(j));
        jelem.removeClass("_"+String(j-1));
        jelem.addClass("_"+String(j));
    }
    
    // Don't forget to save!
    save();
}

function removeListItem_(pnl) {
    // Get panel data
    var pnlp = pnl.parent();
    var i = parseInt(pnl.attr("name"));
    
    // Remove item from data array
    locateData(getPath(pnl.get(0))).splice(i, 1);
    
    // Remove element (and <br> after it)
    pnl.next().remove();
    pnl.remove();
    
    // Move all elements below up one (This is why the rewrite was required)
    var elems = pnlp.find(">div");
    for (let j = i; j < elems.length; j++) {
        let jelem = $(elems[j]);
        jelem.attr("name", String(j));
        jelem.removeClass("_"+String(j+1));
        jelem.addClass("_"+String(j));
    }
    
    // Don't forget to save!
    save();
}
function removeListItem(btn) {
    removeListItem_($(btn.parentElement));
}

function moveListItem(pnl, list) {
    // Remove line break
    var i = parseInt(pnl.attr("name"));
    
    if (i > 0) {
        pnl.prev("br").remove();
        // Swap elements in data
        [list[i-1], list[i]] = [list[i], list[i-1]];
        // Swap elements in html
        var prepnl = pnl.prevAll("div").first();

        prepnl.removeClass("_"+(i-1));
        prepnl.addClass("_"+i);
        prepnl.attr("name", String(i));

        pnl.removeClass("_"+i);
        pnl.addClass("_"+(i-1));
        pnl.attr("name", String(i-1));

        pnl.after(prepnl);
        pnl.after("<br>");
    }
    
    // Don't forget to save!
    save();
}

function listItemUp(btn) {
    var pnl = $(btn.parentElement);
    moveListItem(pnl, locateData(getPath(btn.parentElement)));
}

function listItemDown(btn) {
    // listItemDown kind of cheats by calling list item up on the next panel
    var pnl = $(btn.parentElement).nextAll("div").first();
    if (pnl.length) moveListItem(pnl, locateData(getPath(btn.parentElement)));
}