import { app, protocol, shell, net, ipcMain, BrowserWindow} from 'electron';

import contextMenu from "electron-context-menu";
// const Store = require("electron-store");

const __dirname = import.meta.dirname;

const isOnlineUrl = (url) => (
    url.startsWith("https://discordapp.com/api") ||
    url.startsWith("https://cdn.discordapp.com") ||
    url.startsWith("https://media.ethicalads.io")
);

const isLiveUrl = (url) => (
    url.startsWith("https://www.mathgeniuszach.com") ||
    url.startsWith("https://img.youtube.com") ||
    url.startsWith("https://raw.githubusercontent.com") ||
    url.startsWith("https://cdn.jsdelivr.net") ||
    url.startsWith("https://cdnjs.cloudflare.com") ||
    url.startsWith("https://origins.readthedocs.io") ||
    url.startsWith("http://origins.readthedocs.io") ||
    url.startsWith("origins.readthedocs.io")
);

contextMenu({
    showSearchWithGoogle: false,
    showCopyImageAddress: true,
    showSaveImage: true,
    showSaveImageAs: true,
    showInspectElement: true
});

function createWindow() {
    console.log(__dirname);

    // const store = new Store();

    // Fix file protocol to be relative to app folder instead of filesystem root
    protocol.handle('file', (request) => {
        // console.log(request.url);
        let path = request.url.slice(7);
        if (!path.slice(path.lastIndexOf("/")).includes(".")) path += "/index.html";
        return fetch("file://" + __dirname + "/app" + path);
    });

    // Check if internet is available - this technically isn't guaranteed to work, but meh
    let hasInternet = net.isOnline;

    // Redirect in-window outbound links
    function handleLiveLink(request) {
        // console.log(request.url);
        if (isOnlineUrl(request.url)) {
            // These urls are loaded as is if internet is available, and not loaded otherwise.
            return hasInternet ? fetch(request.url) : new Response("", {status: 404});
        } else if (isLiveUrl(request.url)) {
            // These urls can be loaded from the internet if available.
            if (hasInternet) {
                const resp = fetch(request);
                // Files grabbed from the internet are cached into the live directory.
                return resp;
            }

            // Otherwise, default to the "live" directory, which stores cached versions of online files.
            const q = request.url.indexOf("?");
            let path = "file://" + __dirname + "/live/" + request.url.slice(request.url.indexOf(":")+3, q < 0 ? undefined : q);
            if (!path.slice(path.lastIndexOf("/")).includes(".")) path += "/index.html";
            return fetch(path);
        } else {
            // We should never get here! External links are handled elsewhere and should not request content.
            throw Error("external link is requesting content!");
        }
    }
    protocol.handle('http', handleLiveLink);
    protocol.handle('https', handleLiveLink);

    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: __dirname + "/app/i/oc-icon.png",
        webPreferences: {
            spellcheck: true,
            // contextIsolation: true,
            // enableRemoteModule: false,
            // preload: __dirname + "/preload.js"
        }
    });

    // ipcMain.on('persist-get', (event, key) => {
    //     event.returnValue = store.get(key);
    // });
    // ipcMain.on('persist-set', (event, key, value) => {
    //     store.set(key, value);
    // });
    // ipcMain.on('persist-delete', (event, key) => {
    //     store.delete(key);
    // });
    // ipcMain.on('persist-get-all', (event) => {
    //     return store.store;
    // });

    // Load url instead of file for consistent pathing
    win.loadURL("https://www.mathgeniuszach.com/apps/origin-creator/index.html");

    function fixWindow(window) {
        // Hide the ugly menu
        // window.setMenu(null);
        // Add BASIC RIGHT CLICK FUNCTIONALITY
        // Redirect outbound links to new windows to the actual browser
        window.webContents.setWindowOpenHandler((event) => {
            if (event?.url?.startsWith("http") && !isLiveUrl(event.url)) {
                shell.openExternal(event.url);
                return { action: 'deny' };
            }
            return { action: 'allow' };
            // return { action: 'allow', overrideBrowserWindowOptions: { webPreferences: { preload: __dirname + "/preload.js" } } };
        });
        window.webContents.on("will-navigate", (event) => {
            if (!(event.url.startsWith("file://") || isOnlineUrl(event.url) || isLiveUrl(event.url))) {
                // The rest of the urls are redirected back to the browser
                shell.openExternal(event.url);
                event.preventDefault();
            }
        });
        // Load offline site tweaks
        // Also duck type localStorage because electron can't save it properly.
        // These devs are getting on my nerves.
        // window.webContents.executeJavaScript(`
        //     globalThis.offline = true;
        //     //document.documentElement.toggleAttribute("offline");
        //     // globalThis.oldLocalStorage = localStorage;

        //     // localStorage = {
        //     //     getItem(key) {
        //     //         return persist.get(key);
        //     //     },
        //     //     setItem(key, value) {
        //     //         persist.set(key, value);
        //     //     },
        //     //     removeItem(key) {
        //     //         persist.delete(key);
        //     //     },
        //     //     getAll() {
        //     //         return persist.getAll();
        //     //     }
        //     // }
        // `);
        // Recurse (don't know why this isn't the default)
        window.webContents.on("did-create-window", (window, details) => {
            const pos = window.getPosition();
            window.setPosition(Math.floor(pos[0]+(Math.random()-0.5)*200), Math.floor(pos[1]+(Math.random()-0.5)*200));
            window.setSize(1080, 710);
            // Personal website files have css inserted to toggle on offline display changes, like the header.
            if (details.url.includes("www.mathgeniuszach.com")) {
                window.webContents.insertCSS("html {display: none;} html[offline] {display: block;}");
                win.webContents.executeJavaScript("document.documentElement.toggleAttribute('offline')");
            }
            // Icons for other pages is nice.
            if (details.url.includes("apps/origin-creator/help")) {
                window.setIcon(__dirname + "/app/i/ocfh-icon.png");
            } else if (details.url.includes("origins.readthedocs.io")){
                window.setIcon(__dirname + "/app/i/origins.png");
            }
            fixWindow(window);
        });
    }
    win.webContents.insertCSS("html {display: none;} html[offline] {display: block;}");
    win.webContents.executeJavaScript("document.documentElement.toggleAttribute('offline')");
    fixWindow(win);
}

function fetch(url) {
    return net.fetch(url, {bypassCustomProtocolHandlers: true});
}

app.whenReady().then(() => {
    createWindow();
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});