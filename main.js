const { app, BrowserWindow } = require("electron");
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");

let mainWindow;
let updaterWindow;

const readyEvent = _ => {

  updaterWindow = new BrowserWindow({
    width: 400,
    height: 500,
    resizable: false,
    frame: false
  })
  updaterWindow.loadURL('file://' + __dirname + '/StartUp/index.html');

  autoUpdater.checkForUpdates();

  autoUpdater.on('checking-for-update', () => {
    console.log("chec")
  })
  autoUpdater.on('update-not-available', (info) => {
    console.log("not avu")
  })
  autoUpdater.on('error', (err) => {
    console.log("Something went wrong!")
    console.log(err.name)
  })
  autoUpdater.on('download-progress', (progressObj) => {

  })

  autoUpdater.on('update-downloaded', (info) => {
   autoUpdater.quitAndInstall();  
 })


  updaterWindow.on("close", _ => {
    updaterWindow = null;
  })

};

app.on("ready", readyEvent);

app.on("window-all-closed", _ => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("active", _ => {
  if (updaterWindow === null) {
    readyEvent();
  }
});


function loadMainWindow() {
  if (mainWindow === null)
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 300,
    minWidth: 350,
    frame: false
  });

  //window.loadURL("http://localhost:8080/login");
  mainWindow.loadURL("https://nertivia.tk/login");

  mainWindow.on("close", _ => {
    mainWindow = null;
  });
}
