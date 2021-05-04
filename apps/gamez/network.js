class Lobby {
    constructor() {
        this.peer = new Peer(nanoid());
        this.binds = {};

        // If disconnected from the signalling server, try reconnecting
        this.peer.on("disconnected", async () => {
            try {
                if (!this.peer.destroyed) {
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
                console.error("Peer failure", err);
            }
        });
    }

    // Called on browser close
    destroy() {
        if (!this.peer.destroyed) {
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

        // Listen for remote peer connections
        this.peer.on("connection", (conn) => {
            const uid = conn.metadata.userid;
            console.log(`Received connection from ${uid}`);

            // Cleanup older connection if necessary
            const oldconn = this.conns[uid];
            if (oldconn) oldconn.close();

            // Setup newer connection
            this.conns[uid] = conn;
            // Only on open
            conn.on("open", () => {
                this.timeouts[uid] = 3;

                // Update players array
                players.push({id: uid, name: conn.metadata.username, text: ""});
                this.sendPlayers();
                listPlayers();
            });

            // Listen for messages
            conn.on("error", (err) => {
                console.error(uid, err);
            });
            conn.on("data", (data) => {
                switch (data[0]) {
                    case "$r": // Refresh packet received
                        break;
                    case "$c": // Close packet received
                        this.disconnect(uid);
                        break;
                    default:
                        const func = this.binds[data[0]];
                        if (func) func(uid, ...JSON.parse(data[1]));
                        break;
                }
                if (data[0] !== "$c") this.timeouts[uid] = 3;
            });
        });

        // Subroutine for connection timeouts
        (async () => {
            while (!this.peer.destroyed) {
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

        delete players[getPIndex(id)];
        this.sendPlayers();
    }

    send(id, type, ...args) {
        const conn = this.conns[id];
        if (conn) {
            conn.send([type, JSON.stringify(args)]);
        } else {
            throw Error("Tried to send message to non-connected user");
        }
    }
    sendAll(type, ...args) {
        const data = [type, JSON.stringify(args)];
        for (const conn of Object.values(this.conns)) {
            conn.send(data);
        }
    }
    sendPlayers() {
        this.sendAll("$p", players, selfIndex);
    }
}
class RemoteLobby extends Lobby {
    constructor(id) {
        super();
        this.sid = id;

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
                console.error("Lobby", err);
            });
            // On successful connection
            this.conn.on("open", () => {
                console.log("Connected to lobby");
                // Calls a pre-bound function
                this.conn.on("data", (data) => {
                    switch (data[0]) {
                        case "$r":
                            break;
                        case "$c":
                            this.conn.close();
                            break;
                        case "$p": // Players packet received
                            const pdata = JSON.parse(data[1]);
                            players = pdata[0];
                            selfIndex = getPIndex(userid);
                            hostIndex = pdata[1];
                            listPlayers();
                            break;
                        default:
                            const func = this.binds[data[0]];
                            if (func) func(...JSON.parse(data[1]));
                            break;
                    }
                    if (data[0] !== "$c") this.timeout = 3;
                });

                // Subroutine for connection timeouts
                (async () => {
                    while (!this.peer.destroyed) {
                        // Check if timeout occured
                        if (!this.timeout--) {
                            console.log("Lobby has timed out");
                            this.conn.close();
                            this.peer.destroy();
                        } else {
                            // If timeout has not occured, we try to send a message ourselves
                            this.send("$r");
                        }
                        await sleep(1000);
                    }
                })();
            });
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