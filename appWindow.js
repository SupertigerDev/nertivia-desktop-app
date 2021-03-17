const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { setAppIcon } = require("./utils/AppIconHandler");
const getTray = require("./utils/TrayInstance");

let appWindow = null

module.exports = {
	appWindow,
	loadAppWindow(devMode, url) {
		if (appWindow) return;
		appWindow = new BrowserWindow({
			width: 800,
			height: 600,
			frame: false,
			minWidth: 300,
			webPreferences: {
				preload: path.join(__dirname, "preloaders", 'app.js'),
				webSecurity: devMode

			}
		})

		if (devMode) {
			appWindow.webContents.openDevTools({ mode: 'detach' });
		}
		setAppIcon(appWindow, null, 0);


		appWindow.loadURL(url);
		// windowEvents
		ipcMain.on("window_action", (event, action) => {
			action === "minimize" && appWindow.minimize()
			if (action === "maximize") {
				appWindow.isMaximized() ? appWindow.unmaximize() : appWindow.maximize()
			}
			if (action === "close") {
				appWindow.hide()
			}
		})
		ipcMain.on("notification_badge", (event, action) => {
			setAppIcon(appWindow, getTray(), action);
		})

		getTray().on('click', () => {
			appWindow.show();
		})

	}
}