const {app, BrowserWindow} = require("electron");
const {loadAppWindow} = require("./appWindow");
const updaterWindow = require("./updaterWindow")
const getTray = require("./utils/TrayInstance");
const DEV_MODE = true;
let URL = "https://beta.nertivia.net/app";
if (DEV_MODE) {
  URL = "http://localhost:8080/app";
}

function ready() {
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


