const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog, shell } = require("electron");
const path = require('path')
const log = require('electron-log');
const isDev = require('electron-is-dev');
const { autoUpdater } = require("electron-updater");
const Store = require('electron-store');
const store = new Store();


let mainWindow = null;
let updaterWindow = null;

let tray = null
let appIcon = null;
const args = process.argv;
const startupHidden = args.includes('--hidden')
const iconPath = path.join(__dirname, 'build/icon.ico');
appIcon = nativeImage.createFromPath(iconPath);

const singleInstanceLock = app.requestSingleInstanceLock()


// Single instance lock
if (!singleInstanceLock) {
  app.quit()
} 

//  fix notification sound on startup
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// set startup
setOnLogin(store.get('startup.enabled', true), store.get('startup.minimized', true))

app.on('second-instance', (event, argv, cwd) => {
    if (mainWindow) {
      mainWindow.show();
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
})




const readyEvent = _ => {
  process.on("uncaughtException", (err) => {
     dialog.showErrorBox("Error", err.stack)
     app.quit();
     throw err;
  });
  

  tray = new Tray(appIcon)


  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click:  function(){
        mainWindow.show();
    } },
    { label: 'Quit', click:  function(){
        app.isQuiting = true;
        app.quit();
    } }
  ]);


  tray.setContextMenu(contextMenu);

  tray.setToolTip('Nertivia');
  
  tray.on('click', () => {
    mainWindow.show();
  })


  updaterWindow = new BrowserWindow({
    width: 400,
    height: 500,
    resizable: false,
    frame: false,
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
    frame: false,
    show: !startupHidden,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL("https://nertivia.tk/login");
   //mainWindow.loadURL("http://localhost:8080/login");

  mainWindow.on("close", event => {
    if(!app.isQuiting){
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  ipcMain.on('startupOption',(window, {startApp, startMinimized}) => {
    store.set('startup.enabled', startApp)
    store.set('startup.minimized', startMinimized)
    setOnLogin(startApp, startMinimized)
  })


}


function setOnLogin(start, startMin) {
  const appPath = app.getPath("exe");
  const name = path.basename(appPath);
  app.setLoginItemSettings({
    openAtLogin: start,
    openAsHidden: startMin,
    appPath,
    args: [
      '--processStart', `"${name}"`,
      '--process-start-args', startMin ? `"--hidden"` : '',
    ],
  });
}