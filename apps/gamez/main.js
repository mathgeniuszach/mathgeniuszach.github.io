// Definition of a server for use in PeerJS. Here so I can stop using the free service if I have my own in the future.
const SERVER = undefined;
// Evil character regex
const EVIL_CHAR = /[<>'"`&/\\]+/g;
// Evil character set
const EVIL_CHAR_SET = new Set("<>'\"`&/\\");
// Random temporary names
const NAMES = ["Joey", "George", "Billy", "Bobby"]
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
let loadedGame = null;
// Global game variables. Useful so that the window isn't filled with variables.
// Cleaned on game close.
let G = {};


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
    const code = [];

    // Sanatize player list
    for (const player of Object.values(players)) {
        for (const [key, value] of Object.entries(player)) {
            const svalue = sanatize(value);
            if (svalue !== value) player[key] = svalue;
        }
    }

    // Populate groups
    for (const [key, pids] of Object.entries(groups)) {
        code.push('<div class="pgroup">');

        if (key) code.push(`<div class="heading"><hr>${sanatize(key)}<hr></div>`);
        for (let i = 0; i < pids.length; i++) {
            const pid = sanatize(pids[i]);
            if (pid !== pids[i]) pids[i] = pid;

            const player = players[pid];
            if (player) {
                // We can identify players by their ids, which are safe to be classes! :D
                // Also, you can never be too sure about XSS, so sanatize all around!
                code.push(`<div class="player _${pid}">
                            <b>${sanatize(player.mark)}</b>
                            <i style="color:${sanatize(player.color) || "auto"};">${sanatize(player.name)}</i>
                            <em></em>
                            <span>${sanatize(player.text).replace(/\r\n|\r|\n/g, "<br>")}</span></div>\n`);
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
    // I don't know if css selectors can XSS, but just to be on the safe side
    const sid = sanatize(id);
    const sitem = sanatize(item);

    switch (sitem) {
        case "color":
            const svalue = sanatize(value);
            players[sid].color = svalue;
            for (const elem of qq(`#players ._${sid} > i`)) {
                elem.style.color = svalue;
            }
            break;
        default:
            if (sitem in PLAYER_ITEMS) players[sid][sitem] = value;
            
            for (const elem of qq(`#players ._${sid} > ${PLAYER_ITEMS[sitem] || sitem}`)) {
                elem.textContent = value;
            }
            break;
    }

    // Call signal for name if necessary
    if (lobby && item === "name") lobby.signal("name", id);
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
        if (isHost()) {
            lobby.sendAll("$m", userid, "name", tname);
        } else {
            lobby.send("$m", "name", tname);
        }
    }
}

/**
 * Returns true if the user is hosting, and false otherwise.
 */
function isHost() {
    return lobby instanceof LocalLobby;
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
    loadGame();
}
// Loads a game/html page locally.
function loadGame(game) {
    G = {};
    groups = {"": Object.keys(players)};
    listPlayers();

    if (lobby) {
        lobby.unbindAll();
        if (game) {
            console.log("Loading game", game);
            loadedGame = game;
            $("#game").load(`games/${sanatize(game)}.html`);
        } else {
            console.log("Exiting to main menu");
            loadedGame = null;
            if (isHost()) {
                $("#game").load(`games/index.html`);
            } else {
                $("#game").load(`games/client.html`);
            }
        }
    }
}
// Starts a game.
function start(game) {
    // Let everyone know to load a game
    if (isHost()) {
        lobby.sendAll("$g", game);
        loadGame(game);
    }
}
// Quits the currently loaded game
function quit() {
    if (isHost()) {
        lobby.sendAll("$g");
        loadGame();
    }
}


// Adds a message to the chat.
let lastSender = null;
function addMsg(id, message) {
    const tmsg = sanatize(message).trim();
    const msg = tmsg.length > 100 ? tmsg.slice(0, 97) + "..." : tmsg;

    const cbox = q("#chat-box");
    if (lastSender !== id) {
        cbox.insertAdjacentHTML("beforeend", `<div class="message"><b>${sanatize(players[id].name)}</b><br><div>${msg}</div></div>`);
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
                if (!isHost() || id === userid) {
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
                const tvalue = this.value.trim();
                if (0 < tvalue.length && tvalue.length <= 100) {
                    if (isHost()) {
                        addMsg(userid, tvalue);
                        lobby.sendAll("$t", userid, tvalue);
                    } else {
                        lobby.send("$t", tvalue);
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
        lobby = new LocalLobby(urlParams.has("offline"));
    }
    
    // Reset values and stuff to default
    reset();
});