const { BrowserWindow } = require("electron");
const path = require("path");

let appWindow = null

module.exports = function loadAppWindow(url) {
	if (appWindow) return;
	updaterWindow = new BrowserWindow({
		width: 800,
		height: 600,
		frame: false,
		webPreferences: {
			enableRemoteModule: true,
			preload: path.join(__dirname , "preloaders",'app.js'),
			webSecurity: false

		}
	})
	updaterWindow.loadURL(url);
}