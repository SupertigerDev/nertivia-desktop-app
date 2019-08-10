const { app, BrowserWindow } = require("electron");
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");

autoUpdater.logger = log

let window;

const createWindow = _ => {
  console.log(app.getVersion())
  autoUpdater.checkForUpdatesAndNotify();
  window = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 300,
    minWidth: 350,
    frame: false
  });

  //window.loadURL("http://localhost:8080/login");
  window.loadURL("https://nertivia.tk/login");

  window.on("close", _ => {
    window = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", _ => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("active", _ => {
  if (window === null) {
    createWindow();
  }
});
