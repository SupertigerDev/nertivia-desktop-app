const { ProcessListen } = require("active-window-listener");
const { BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { setAppIcon } = require("./utils/AppIconHandler");
const runningPrograms = require("./utils/runningPrograms");
const startup = require("./utils/startup");
const {store} = require("./utils/storeInstance");
const getTray = require("./utils/TrayInstance");
const args = process.argv;
const startupHidden = args.includes('--hidden')

let appWindow = null
let activityListener;
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
		ipcMain.on("activity_listener_restart", (event, arr) => {
			startListeningProgramActivity(arr);
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
		ipcMain.handle('get_running_programs', async (event, storedPrograms = []) => {
			return await runningPrograms(storedPrograms)
		});

		getTray().on('click', () => {
			appWindow.show();
		})

	}
}

function startListeningProgramActivity(programArr = []) {
	activityListener?.clearEvent?.()
	if (!programArr.length) {
		appWindow.webContents.send('activity_status_changed', false)
		return
	};
	const programNameArr = programArr.map(p => p.filename);
	activityListener = new ProcessListen(programNameArr);
	activityListener.changed((window) => {
	  if (!window) return appWindow.webContents.send('activity_status_changed', false)
	  appWindow.webContents.send('activity_status_changed', window.path.split("\\")[window.path.split("\\").length - 1]);
	})
  }