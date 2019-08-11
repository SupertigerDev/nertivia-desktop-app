const { app, BrowserWindow, ipcMain, } = require("electron");
const log = require('electron-log');
const isDev = require('electron-is-dev');
const { autoUpdater } = require("electron-updater");



let mainWindow = null;
let updaterWindow = null;

const readyEvent = _ => {

  updaterWindow = new BrowserWindow({
    width: 400,
    height: 500,
    resizable: false,
    frame: false
  })
  updaterWindow.loadURL('file://' + __dirname + '/StartUp/index.html');

  ipcMain.once('loaded',() => {
    autoUpdater.checkForUpdates()
  })
  
  autoUpdater.on('checking-for-update', () => {
    sendUpdaterMessages('CHECKING_UPDATE')
  })
  
  autoUpdater.on('update-not-available', (info) => {
    autoUpdater.removeAllListeners()
    sendUpdaterMessages('NO_UPDATE')
    setTimeout(() => {
      loadMainWindow()
      updaterWindow.close();
    }, 1000);
  })

  autoUpdater.on('error', (err) => {
    autoUpdater.removeAllListeners()
    sendUpdaterMessages('ERROR', err.message)
    if (isDev)
      setTimeout(() => {
        //loadMainWindow()
        //updaterWindow.close();
      }, 1000);
  })

  autoUpdater.on('download-progress', (progressObj) => {
    sendUpdaterMessages('DOWNLOAD_PROGRESS', progressObj);
  })

  autoUpdater.on('update-downloaded', (info) => {
   autoUpdater.quitAndInstall();  
  })

  updaterWindow.once("close", _ => {
    updaterWindow = null;
  })

  function sendUpdaterMessages(name, message) {
    updaterWindow.webContents.send('updater', {name, message})
  }

};

app.once("ready", readyEvent);

app.on("active", _ => {
  if (updaterWindow === null) {
    readyEvent();
  }
});


function loadMainWindow() {
  if (mainWindow !== null) return;
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 300,
    minWidth: 350,
    frame: false
  });
  mainWindow.loadURL("https://nertivia.tk/login");

  mainWindow.on("close", _ => {
    mainWindow = null;
    app.quit();
  });
}
