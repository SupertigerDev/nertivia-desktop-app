const {app, Tray, Menu} = require("electron");
const {appWindow} = require("../appWindow");
const {appIcon} = require("./AppIconHandler");
let tray;

const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        if (appWindow) {
          appWindow.show();
        }
      }
    },
    {
      label: 'Quit', click: function () {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);


module.exports = function getTray() {
    if (tray) return tray;
    tray = new Tray(appIcon);
    tray.setToolTip('Nertivia');
    tray.setContextMenu(contextMenu)
    return tray;
}