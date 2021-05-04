$(() => {
    $("header").load("/header.html");
    $("footer").load("/footer.html");
});

const q = document.querySelector.bind(document);
const qq = document.querySelectorAll.bind(document);

// Slightly less secure nanoid
const nanoid=(t=25)=>{let e="",r=crypto.getRandomValues(new Uint8Array(t));for(;t--;){const n=63&r[t];e+=n<36?n.toString(36):n<62?(n-26).toString(36).toUpperCase():n<63?"x":"X"}return e};

// Slep method
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Asyncronious message box (for input)
async function msgBox(message, buttons=["Ok"]) {

}