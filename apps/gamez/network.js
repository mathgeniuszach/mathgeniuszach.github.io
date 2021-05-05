class Lobby {
    constructor() {
        this.peer = new Peer(nanoid());
        this.binds = {};

        // If disconnected from the signalling server, try reconnecting
        this.peer.on("disconnected", async () => {
            try {
                if (!this.destroyed) {
                    console.warn("Disconnected from signalling server, trying to reconnect in 3 seconds");
                    await sleep(3000);
                    this.peer.reconnect();
                }
            } catch (err) {}
        });
        this.peer.on("error", (err) => {
            if (err.type == "browser-incompatible") {
                q("#error-div").classList.remove("nodisplay");
            } else {
                console.error("Peer", err);
            }
        });
    }

    // Called on browser close
    destroy() {
        if (!this.destroyed) {
            this.destroyed = true;
            this.peer.destroy();
        }
    }

    // For binding recieving messages
    bind(type, func) {
        this.binds[type] = func;
    }
}

class LocalLobby extends Lobby {
    constructor() {
        super();
        this.sid = this.peer.id;

        this.conns = {};
        this.timeouts = {};

        this.peer.on("open", () => {
            q("#status").textContent = "Hosting";
        });

        // Listen for remote peer connections
        this.peer.on("connection", (conn) => {
            const uid = conn.metadata.userid;
            console.log(`Received connection from ${uid}`);

            // Cleanup older connection if necessary
            const oldconn = this.conns[uid];
            if (oldconn) oldconn.close();

            // Kick banned players
            if (uid in banned) {
                conn.close();
                return;
            }

            // Setup newer connection
            this.conns[uid] = conn;

            // Only on open
            conn.on("open", () => {
                this.timeouts[uid] = 3;

                // Update players array
                players[uid] = {name: conn.metadata.username, text: ""};
                groups[""].push(uid);
                this.sendPlayers();
                listPlayers();
            });

            // Listen for messages
            conn.on("error", (err) => {
                console.error(uid, err.type, err);
            });
            conn.on("data", (data) => {
                const key = data[0];
                const args = JSON.parse(data[1]);

                switch (key) {
                    case "$r": // Refresh packet received
                        break;
                    case "$c": // Close packet received
                        this.disconnect(uid);
                        break;
                    case "$m": // Metadata packet received
                        setMeta(uid, ...args);
                        this.sendAllOthers(uid, "$m", uid, ...args);
                        break;
                    case "$t": // Chat packet received
                        addMsg(uid, args[0]);
                        this.sendAll("$t", uid, args[0]);
                        break;
                    default:
                        const func = this.binds[key];
                        if (func) func(uid, ...args);
                        break;
                }
                if (key !== "$c") this.timeouts[uid] = 3;
            });
        });

        // Subroutine for connection timeouts
        (async () => {
            while (!this.destroyed) {
                for (const id of Object.keys(this.timeouts)) {
                    // Check if timeout occured
                    if (!this.timeouts[id]--) {
                        console.log(`${id} has timed out`);
                        this.disconnect(id);
                    } else {
                        // If timeout has not occured, we try to send a message ourselves
                        this.send(id, "$r");
                    }
                }
                await sleep(1000);
            }
        })();
    }

    disconnect(id) {
        this.conns[id].close();
        delete this.conns[id];
        delete this.timeouts[id];

        // Delete id in all groups
        for (const group of Object.values(groups)) {
            let i = group.length;
            for (;i--;) {
                if (group[i] === id) group.splice(i, 1);
            }
        }

        // Update players
        delete players[id];
        this.sendPlayers();
        listPlayers();
    }

    send(id, type, ...args) {
        const conn = this.conns[id];
        if (conn) {
            conn.send([type, JSON.stringify(args)]);
        } else {
            throw Error("Tried to send message to non-connected user");
        }
    }
    sendMulti(ids, type, ...args) {
        const data = [type, JSON.stringify(args)];
        for (const id of ids) {
            const conn = this.conns[id];
            if (conn) {
                conn.send(data);
            } else {
                // Console error, but not thrown error
                console.error("Tried to send message to non-connected user");
            }
        }
    }
    sendAll(type, ...args) {
        const data = [type, JSON.stringify(args)];
        for (const conn of Object.values(this.conns)) {
            conn.send(data);
        }
    }
    sendAllOthers(id, type, ...args) {
        const data = [type, JSON.stringify(args)];
        for (const [pid, conn] of Object.entries(this.conns)) {
            if (id !== pid) conn.send(data);
        }
    }
    sendPlayers() {
        this.sendAll("$p", groups, players, userid);
    }
}
class RemoteLobby extends Lobby {
    constructor(id) {
        super();
        this.sid = id;
        this.open = false;

        this.peer.on("open", () => {
            // Connect to remote peer
            this.conn = this.peer.connect(id, {
                metadata: {
                    userid,
                    username
                },
                reliable: true
            });
            this.timeout = 3;
            
            // In the case of any error
            this.conn.on("error", (err) => {
                console.error("Lobby", err.type, err);
            });
            // On successful connection
            this.conn.on("open", () => {
                this.open = true;
                q("#status").textContent = "In Lobby";
                console.log("Connected to lobby");
                // Calls a pre-bound function
                this.conn.on("data", (data) => {
                    const key = data[0];
                    const args = JSON.parse(data[1]);

                    switch (key) {
                        case "$r": // Refresh packet received
                            break;
                        case "$c": // Close packet received
                            this.conn.close();
                            break;
                        case "$p": // Players packet received
                            groups = args[0]
                            players = args[1];
                            hostid = args[2];
                            listPlayers();
                            break;
                        case "$m": // Metadata packet received
                            setMeta(...args);
                            break;
                        case "$t": // Chat packet received
                            addMsg(args[0], args[1]);
                            break;
                        default:
                            const func = this.binds[key];
                            if (func) func(...args);
                            break;
                    }
                    if (key !== "$c") this.timeout = 3;
                });
            });

            // Subroutine for connection timeouts
            (async () => {
                while (!this.destroyed) {
                    // Check if timeout occured
                    if (!this.timeout--) {
                        const mb = (i) => {
                            switch (i) {
                                case 1: // Reconnect
                                    q("#status").textContent = "Connecting...";
                                    lobby = new RemoteLobby(this.sid);
                                    break;
                                default: // Leave
                                    window.location = location.origin + location.pathname;
                                    break;
                            }
                        };

                        if (this.open) {
                            q("#status").textContent = "Timeout";
                            console.log("Lobby has timed out");
                            this.conn.close();
                            msgBox("Lost connection with lobby.<br>What do you want to do?<br>(Wait a bit before reconnecting)", ["Leave", "Reconnect"], mb);
                            this.destroy();
                        } else {
                            q("#status").textContent = "Failure";
                            console.log("Could not connect to lobby");
                            this.conn.close();
                            msgBox("Could not connect to lobby.<br>What do you want to do?<br>", ["Leave", "Retry"], mb);
                            this.destroy();
                        }
                    } else if (this.open) {
                        // If timeout has not occured, we try to send a message ourselves
                        this.send("$r");
                    }
                    await sleep(1000);
                }
            })();
        });
    }

    // Sends a message to the lobby host
    send(type, ...args) {
        if (this.conn) {
            this.conn.send([type, JSON.stringify(args)]);
        } else {
            throw Error("Tried to send message when not connected!");
        }
    }
}