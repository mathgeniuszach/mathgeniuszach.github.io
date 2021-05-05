// Definition of a server for use in PeerJS. Here so I can stop using the free service if I have my own in the future.
const SERVER = undefined;
// Evil character regex
const EVIL_CHAR = /[^\w .,;:]+/g;
// Random temporary names
const NAMES = ["Joey", "George", "Billy", "Bob"]
// Player items mapper
const PLAYER_ITEMS = {
    "name": "i",
    "mark": "b",
    "text": "span"
}
// Url parameters
const urlParams = new URLSearchParams(window.location.search);

// User persistent id
const userid = (urlParams.has("temp") && nanoid()) || localStorage.getItem("gamez-id") || getID();
// Username
let username = (urlParams.has("temp") && choose(NAMES)) || sanatize(localStorage.getItem("gamez-name")) || "player";


// lobby, local or remote
let lobby = null;
let hostid = userid;
// Banlist
let banned = {};

// Player groups 
let groups = {};
// Players 
let players = {};


// Currently loaded game
let game = null;


/**
 * Sanatizes the given text by stripping it of bad html characters.
 * @param {string} text Text to sanatize
 * @returns {string} Sanatized text
 */
function sanatize(text) {
    if (!text) return "";
    return text.replace(EVIL_CHAR, "");
}

/**
 * Populates the sidebar with players and headings.
 */
function listPlayers() {
    // Create html list
    let code = [];

    for (const [key, pids] of Object.entries(groups)) {
        code.push('<div class="pgroup">');

        if (key) code.push(`<div class="heading"><hr>${key}<hr></div>`);
        for (let i = 0; i < pids.length; i++) {
            const pid = pids[i];
            const player = players[pid];
            if (player) {
                // We can identify players by their ids, which are safe to be classes! :D
                code.push(`<div class="player _${pid}">
                            <b>${sanatize(player.mark)}</b>
                            <i style="color:${sanatize(player.color) || "auto"};">${sanatize(player.name)}</i>
                            <em></em>
                            <span>${sanatize(player.text)}</span></div>\n`);
            } else {
                // If the player doesn't exist in array, then this player has left
                // Therefore we remove it from the group
                pids.splice(i, 1);
                i--;
            }
        }

        code.push('</div>');
    }

    q("#players").innerHTML = code.join("");
    setMeta(hostid, "em", "H");
    setMeta(userid, "em", "I");
}

/**
 * Sets player metadata, updating all already displayed data.
 * @param {string} id Id of a player
 * @param {string} item Meta item of the player to change
 * @param {string} value Value to change the meta item to
 */
function setMeta(id, item, value) {
    switch (item) {
        case "color":
            players[id].color = value;
            for (const elem of qq(`#players ._${id} > i`)) {
                elem.style.color = sanatize(value);
            }
            break;
        default:
            if (item in PLAYER_ITEMS) players[id][item] = value;
            
            for (const elem of qq(`#players ._${id} > ${PLAYER_ITEMS[item] || item}`)) {
                elem.textContent = value;
            }
            break;
    }
}

/**
 * Changes the user's name.
 * @param {string} name Name to change to
 */
function changeName(name) {
    // Sanatize username
    const tname = sanatize(name);

    localStorage.setItem('gamez-name', tname);
    username = tname;
    q("#username").value = tname;

    // Fingers crossed this doesn't lead to desync
    setMeta(userid, "name", tname);

    // Send a message to everyone that our name has been changed
    if (lobby) {
        if (lobby instanceof RemoteLobby) {
            lobby.send("$m", "name", tname);
        } else {
            lobby.sendAll("$m", userid, "name", tname);
        }
    }
}

// Get or generate a persistent unique id
function getID() {
    const tid = nanoid();
    localStorage.setItem("gamez-id", tid);
    return tid;
}

// Safely resets players and other things to default values.
function reset() {
    players = {
        [userid]: {name: username, mark: "", text: ""}
    };
    clean();
}
// Cleans up things between games.
function clean() {
    groups = {"": Object.keys(players)};

    if (lobby instanceof LocalLobby) {
        $("#game").load("games/index.html");
    }
}


// Adds a message to the chat.
let lastSender = null;
function addMsg(id, message) {
    const msg = message.length > 100 ? msg.slice(0, 97) + "..." : message;

    const cbox = q("#chat-box");
    if (lastSender !== id) {
        cbox.insertAdjacentHTML("beforeend", `<div class="message"><b>${players[id].name}</b><br><div>${msg}</div></div>`);
    } else {
        cbox.insertAdjacentHTML("beforeend", `<div class="message"><div>${msg}</div></div>`);
    }

    cbox.scrollTop = 10000000;
    lastSender = id;
}


$(() => {
    // Set username field to loaded value
    q("#username").value = username;

    // Setup click handler for players
    $("#players").click((e) => {
        const player = e.target.parentElement;
        if (player.classList.contains("player")) {
            if (lobby) {
                // This is a player, so open up a player box
                const name = player.querySelector("i").textContent;
                const id = player.classList[1].slice(1);
                if (lobby instanceof RemoteLobby || id === userid) {
                    msgBox(`${name} (${id})`, ["Close"]);
                } else {
                    msgBox(`${name} (${id})`, ["Close", "Kick", "Ban"], (i) => {
                        switch (i) {
                            case 2:
                                banned[id] = true;
                            case 1:
                                lobby.disconnect(id);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        }
    });

    // Setup chat to send on enter key
    $("#chat-field").on("keydown", function (e) {
        if (lobby) {
            if (e.which == 13) {
                if (0 < this.value.length && this.value.length <= 100) {
                    if (lobby instanceof RemoteLobby) {
                        lobby.send("$t", this.value);
                    } else {
                        addMsg(userid, this.value);
                        lobby.sendAll("$t", userid, this.value);
                    }
                    this.value = "";
                }
            }
        }
    });

    // Setup server
    if (urlParams.has("lobby")) {
        // The lobby is remote, meaning someone else is hosting
        lobby = new RemoteLobby(urlParams.get("lobby"));
    } else {
        // The lobby is local, meaning we are hosting
        lobby = new LocalLobby();
    }
    
    // List default players
    reset();
    listPlayers();
});