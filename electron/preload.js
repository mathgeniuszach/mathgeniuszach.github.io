const { ipcRenderer, contextBridge } = require('electron');

// contextBridge.exposeInMainWorld('persist', {
//     get: (key) => ipcRenderer.sendSync('persist-get', key),
//     set: (key, value) => ipcRenderer.sendSync('persist-set', key, value),
//     delete: (key) => ipcRenderer.sendSync('persist-delete', key),
//     getAll: () => ipcRenderer.sendSync('persist-get-all')
// });
contextBridge.exposeInMainWorld("offline", true);

// globalThis.oldLocalStorage = localStorage;

// localStorage = {
//     getItem(key) {
//         return persist.get(key);
//     },
//     setItem(key, value) {
//         persist.set(key, value);
//     },
//     removeItem(key) {
//         persist.delete(key);
//     },
//     getAll() {
//         return persist.getAll();
//     }
// }