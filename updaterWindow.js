const { BrowserWindow, ipcMain } = require("electron");
const path = require('path');

let updaterWindow = null

module.exports = function loadUpdaterWindow(devMode, done) {
	if (updaterWindow) return;
	updaterWindow = new BrowserWindow({
		width: 400,
		height: 400,
		resizable: false,
		frame: false,
		transparent: true,
		webPreferences: {
			preload: path.join(__dirname , "preloaders",'updater.js'),
		}
	})
	const checkUpdate = (event, args) => {
		if (devMode) {
			updaterWindow.webContents.send("skip_update", "Dev Mode");
			return;
		}
		updaterWindow.webContents.send("skip_update", "Not Implimented");
	}
	const closeUpdater = (event, args) => {
		ipcMain.off("check_update", checkUpdate);
		ipcMain.off("close_updater", closeUpdater);
		done(true);
		setTimeout(() => {
			updaterWindow.destroy();
			updaterWindow = null;
		}, 500);
	}
	ipcMain.on("check_update", checkUpdate)
	ipcMain.on("close_updater", closeUpdater)
	if (devMode) {
		// updaterWindow.webContents.openDevTools({mode: 'detach'});
	}
	updaterWindow.loadURL(path.join(__dirname, "view", "updater", "index.html"));
}