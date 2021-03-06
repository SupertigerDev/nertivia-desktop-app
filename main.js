const {app, BrowserWindow} = require("electron");
const appWindow = require("./appWindow");
const updaterWindow = require("./updaterWindow")

const DEV_MODE = true;
let URL = "https://beta.nertivia.net/app";
if (DEV_MODE) {
  URL = "http://localhost:8080/app";
}

function ready() {
  updaterWindow(DEV_MODE, done => {
    if (!done) return;
    appWindow(URL);
  })
}

app.whenReady().then(ready)


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


