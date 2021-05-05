const q = document.querySelector.bind(document);
const qq = document.querySelectorAll.bind(document);

$(() => {
    $("header").load("/header.html");
    $("footer").load("/footer.html");
    $("sbutton").replaceWith('<button id="show-sidebar" onclick="toggleSidebar(this);">+</button>');
});

// Slightly less secure nanoid
const nanoid=(t=25)=>{let e="",r=crypto.getRandomValues(new Uint8Array(t));for(;t--;){const n=63&r[t];e+=n<36?n.toString(36):n<62?(n-26).toString(36).toUpperCase():n<63?"x":"X"}return e};

// Sleep method
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Chooses a random element of an array
function choose(array) {
    return array[~~(Math.random() * array.length)];
}

// Toggles the sidebar for mobile devices
function toggleSidebar(btn, query="aside") {
    const aside = q(query);

    if (aside.classList.contains("shown")) {
        aside.classList.remove("shown");
        btn.textContent = "+";
    } else {
        aside.classList.add("shown");
        btn.textContent = "-";
    }
}
// Toggles an element
function toggle(elem) {
    if (elem.classList.contains("nodisplay")) {
        elem.classList.remove("nodisplay");
    } else {
        elem.classList.add("nodisplay");
    }
}


// For custom message boxes!
const msgBoxCallbacks = [];

function msgBoxClose(btn, index) {
    const div = btn.parentElement.parentElement;
    const i = Array.prototype.indexOf.call(div.parentElement.children, div);
    div.remove();

    const callback = msgBoxCallbacks.splice(i, 1)[0];
    if (callback) callback(index);
}

// Asyncronious message box (for input)
function msgBox(message, buttons=["Ok"], callback) {
    const dialogs = q("#dialogs");
    if (dialogs) {
        let code = [];
        code.push("<div>");

        code.push(`<p>${message}</p>`);
        code.push('<div class="buttons">');
        for (let i = 0; i < buttons.length; i++) {
            code.push(`<button onclick="msgBoxClose(this, ${i})">${buttons[i]}</button>`)
        }
        code.push("</div>")

        code.push("</div>");

        dialogs.insertAdjacentHTML("afterbegin", code.join(""));
        msgBoxCallbacks.unshift(callback);
    } else {
        throw Error('No element with id "dialogs" found on page!');
    }
}

// Binds dragging methods onto a modal element, while also adding a header.
function modal(elem, name) {
    elem.insertAdjacentHTML("afterbegin", `<div class="modal-head"><span>${name}</span><button onclick="this.parentElement.parentElement.classList.add('nodisplay')">x</button></div>`)

    // Bind dragging methods onto element
    const head = elem.querySelector(".modal-head");
    head.onmousedown = dragDown;

    // Variables and Functions
    let x = 0, y = 0, dx = 0, dy = 0;
    function dragDown(e) {
        console.log("down");
        // Cancel event propagation
        e = e || window.event;
        e.preventDefault();
        // Get starting mouse position
        x = e.clientX;
        y = e.clientY;
        // Change document handler functions
        document.onmouseup = dragUp;
        document.onmousemove = dragMove;
    }
    function dragMove(e) {
        console.log("move");
        // Cancel event propagation
        e = e || window.event;
        e.preventDefault();
        // Get mouse delta
        dx = e.clientX - x;
        dy = e.clientY - y;
        x = e.clientX;
        y = e.clientY;
        // Set element new position
        elem.style.top = elem.offsetTop + dy + "px";
        elem.style.left = elem.offsetLeft + dx + "px";
    }
    function dragUp(e) {
        console.log("up");
        // Cancel event propagation
        e = e || window.event;
        e.preventDefault();
        // Reset event handlers (hopefully, nothing uses these)
        document.onmouseup = null;
        document.onmousemove = null;
    }
}