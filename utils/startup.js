const { app } = require("electron");
const { startup } = require("./storeInstance");
const path = require("path");
module.exports = function setOnLogin() {
  const start = startup.enabled()
  const startMin = startup.minimized()
  const appPath = app.getPath("exe");
  const name = path.basename(appPath);
  app.setLoginItemSettings({
    enabled: start,
    openAtLogin: start,
    openAsHidden: startMin,
    appPath,
    args: [
      '--processStart', `"${name}"`,
      '--process-start-args', startMin ? `"--hidden"` : '',
    ],
  });
}