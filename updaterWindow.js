const { BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");

const path = require('path');
const { setAppIcon } = require("./utils/AppIconHandler");

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
	setAppIcon(updaterWindow, null, 0);

	const checkUpdate = (event, args) => {
		if (devMode) {
			updaterWindow.webContents.send("skip_update", "Dev Mode");
			return;
		}
		autoUpdater.checkForUpdates();
		
		
		// updaterWindow.webContents.send("skip_update", "Not Implimented");
	}
	autoUpdater.on("update-not-available", () => {
		autoUpdater.removeAllListeners()
		updaterWindow.webContents.send("skip_update", "No Updates.");
	})
	autoUpdater.on("error", (err) => {
		autoUpdater.removeAllListeners()
		updaterWindow.webContents.send("skip_update", err.message);
	})
	autoUpdater.on('update-available', (progressObj) => {
		updaterWindow.webContents.send('update_available');
	})
	autoUpdater.on('update-downloaded', (info) => {
		autoUpdater.quitAndInstall();
	})
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
	updaterWindow.loadFile(path.join(__dirname, "view", "updater", "index.html"));
}