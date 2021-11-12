const {
    contextBridge,
    ipcRenderer,
    remote,
    desktopCapturer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        isElectron: true,
        desktopCapturer,
        // window: {
        //     minimize: remote.BrowserWindow.getFocusedWindow().minimize(),
        //     maximize: remote.BrowserWindow.getFocusedWindow().maximize(), 
        //     close: remote.BrowserWindow.getFocusedWindow().close(),
        // },
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["window_action", "notification_badge", "activity_listener_restart"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["window_action", "activity_status_changed"];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        invoke: (channel, ...args) => {
            return new Promise((res) => {
                ipcRenderer.invoke(channel, ...args).then((val) => {
                    res(val);
                })
            })
        },
    }
);