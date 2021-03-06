const { BrowserWindow } = require("electron");
const path = require("path");

let appWindow = null

module.exports = function loadAppWindow(url) {
	if (appWindow) return;
	appWindow = new BrowserWindow({
		width: 800,
		height: 600,
		frame: false,
		minWidth: 300,
		webPreferences: {
			enableRemoteModule: true,
			preload: path.join(__dirname , "preloaders",'app.js'),
			webSecurity: false

		}
	})
	appWindow.webContents.openDevTools({mode: 'detach'});
	appWindow.loadURL(url);
}