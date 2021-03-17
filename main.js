const {app, BrowserWindow} = require("electron");
const {loadAppWindow, getAppWindow} = require("./appWindow");
const updaterWindow = require("./updaterWindow")
const getTray = require("./utils/TrayInstance");
const DEV_MODE = true;
let URL = "https://beta.nertivia.net/app";
if (DEV_MODE) {
  URL = "http://localhost:8080/app";
}
const singleInstanceLock = app.requestSingleInstanceLock()

app.on('second-instance', (event, argv, cwd) => {
  if (getAppWindow()) {
    getAppWindow().show();
    if (getAppWindow().isMinimized()) getAppWindow().restore();
    getAppWindow().focus();
  }
})




function ready() {
  if (!singleInstanceLock){
    app.quit();
    return;
  }
  getTray();
  updaterWindow(DEV_MODE, done => {
    if (!done) return;
    loadAppWindow(DEV_MODE, URL);
  })
}

app.whenReady().then(ready)


app.on('window-all-closed', () => {
  getTray().destroy();
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


