const { Tray, Menu} = require("electron");
const {appIcon} = require("./AppIconHandler");
let tray;

const contextMenu = () => {
  return Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        require("../appWindow").getAppWindow()?.show()
      }
    },
    {
      label: 'Quit', click: function () {
        const app = require("electron").app;
        require("../appWindow").getAppWindow()?.close()
        require("../appWindow").getAppWindow()?.destroy()
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
}


module.exports = function getTray(appWidow) {
    if (tray) return tray;
    tray = new Tray(appIcon);
    tray.setToolTip('Nertivia');
    tray.setContextMenu(contextMenu())
    return tray;
}