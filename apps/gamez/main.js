// Definition of a server for use in PeerJS. Here so I can stop using the free service if I have my own in the future.
const SERVER = undefined;
// Evil character regex
const EVIL_CHAR = /[^\w .,;:]+/g;
// Url parameters
const urlParams = new URLSearchParams(window.location.search);

// User persistent id
const userid = (urlParams.has("temp") && nanoid()) || localStorage.getItem("gamez-id") || getID();
// Username
let username = sanatize(localStorage.getItem("gamez-name") || "player");

// lobby
let lobby = null;

// Players array
let players = [{id: userid, name: username, text: ""}];
let hostIndex = 0;
let selfIndex = 0;
let turn = -1;

function getPIndex(id) {
    return players.findIndex((p) => p.id === id);
}
function getPlayer(id) {
    const index = getPIndex(id);
    if (index < 0) {
        return null;
    } else {
        return players[index];
    }
}

// Sanitization function
function sanatize(text) {
    return text.replace(EVIL_CHAR, "");
}

// Recreate players from array
function listPlayers() {
    // Create html list
    let code = [];

    for (const player of players) {
        code.push(`<div><b></b><i>${sanatize(player.name)}</i><em></em><span>${sanatize(player.text)}</span></div>\n`);
    }

    q("#players").innerHTML = code.join("");
    if (turn > -1) setPText(turn, "•", "b");
    setPText(hostIndex, "H", "em");
    setPText(selfIndex, "I", "em");
}
function setPText(id, text, item="i") {
    q(`#players > :nth-child(${id+1}) > ${item}`).textContent = text;
}

function changeTurn(n) {
    if (turn > -1) setPText(turn, "", "b");
    turn = n;
    if (turn > -1) setPText(turn, "•", "b");
}

function changeHost(n) {
    setPText(hostIndex, "", "em");
    hostIndex = n;
    setPText(hostIndex, "H", "em");
}

// Change the username.
function changeName(name) {
    // Sanatize username
    const tname = sanatize(name);

    localStorage.setItem('gamez-name', tname);
    username = tname;
    q("#username").value = tname;

    setPText(selfIndex, tname, "i");
    players[selfIndex].name = tname;

    // Send a message to everyone that our name has been changed
    if (lobby) {
        if (lobby instanceof RemoteLobby) {
            lobby.send("pname", selfIndex, tname);
        } else {
            lobby.sendAll("pname", selfIndex, tname);
        }
    }
}

// Get or generate a persistent unique id
function getID() {
    const tid = nanoid();
    localStorage.setItem("gamez-id", tid);
    return tid;
}



$(() => {
    // Set username
    q("#username").value = username;
    
    // List default players
    listPlayers();

    // Setup server
    if (urlParams.has("lobby")) {
        lobby = new RemoteLobby(urlParams.get("lobby"));
        lobby.bind("log", (msg) => {
            console.log(msg);
        });
        lobby.bind("pname", (pid, name) => {
            players[pid].name = name;
            setPText(pid, name, "i");
        });
    } else {
        lobby = new LocalLobby();
        lobby.bind("log", (id, msg) => {
            console.log(id, msg);
        });
        lobby.bind("pname", (id, pid, name) => {
            console.log(pid);
            players[pid].name = name;
            setPText(pid, name, "i");
            lobby.sendAll("pname", pid, name);
        })
    }
});