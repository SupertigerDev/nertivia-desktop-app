const { app, BrowserWindow, ipcMain, Tray, Menu} = require("electron");
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
    if (isDev)
      loadMainWindow()
      updaterWindow.close();
    autoUpdater.removeAllListeners()
    sendUpdaterMessages('ERROR', err.message)
  })

  autoUpdater.on('update-available', (progressObj) => {
    sendUpdaterMessages('UPDATE_AVAILABLE');
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
    width: 1200,
    height: 800,
    minHeight: 300,
    minWidth: 350,
    frame: false
  });
  mainWindow.loadURL("https://nertivia.tk/login");
  // mainWindow.loadURL("http://localhost:8080/login");

  mainWindow.on("close", event => {
    if(!app.isQuiting){
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  var contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click:  function(){
        mainWindow.show();
    } },
    { label: 'Quit', click:  function(){
        app.isQuiting = true;
        app.quit();
    } }
  ]);


  var appIcon = null;
  appIcon = new Tray('./build/icon.ico');

  var contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click:  function(){
        mainWindow.show();
    } },
    { label: 'Quit', click:  function(){
        app.isQuiting = true;
        app.quit();
    } }
  ]);

  appIcon.setToolTip('Nertivia');
  
  appIcon.on('click', () => {
    mainWindow.show();
  })
  appIcon.setContextMenu(contextMenu);



}
