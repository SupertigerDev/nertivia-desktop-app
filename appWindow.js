const { BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { setAppIcon } = require("./utils/AppIconHandler");
const startup = require("./utils/startup");
const {store} = require("./utils/storeInstance");
const getTray = require("./utils/TrayInstance");
const args = process.argv;
const startupHidden = args.includes('--hidden')

let appWindow = null

module.exports = {
	getAppWindow() {
		return appWindow
	},
	loadAppWindow(devMode, url) {
		if (appWindow) return;
		appWindow = new BrowserWindow({
			width: 800,
			height: 600,
			frame: false,
			minWidth: 300,
			show: !startupHidden,
			webPreferences: {
				preload: path.join(__dirname, "preloaders", 'app.js'),
				webSecurity: !devMode
			}
		})

		if (devMode) {
			appWindow.webContents.openDevTools({ mode: 'detach' });
		}
		setAppIcon(appWindow, null, 0);


		appWindow.loadURL(url);

		appWindow.webContents.on('new-window', (event, url) => {
			event.preventDefault();
			shell.openExternal(url);
		});
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
		ipcMain.handle('get_store_value', (event, key, defaultValue) => {
			return store.get(key, defaultValue);
		});
		ipcMain.handle('set_store_value', (event, key, value) => {
			store.set(key, value);
			if (key.startsWith("startup")) {
				// set startup options
				startup();
			}
		});

		getTray().on('click', () => {
			appWindow.show();
		})

	}
}