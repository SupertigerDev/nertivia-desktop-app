const { ipcRenderer } = require("electron");
const log = require('electron-log');

const constants = {
  CHECKING_UPDATE: "CHECKING_UPDATE",
  NO_UPDATE: "NO_UPDATE",
  ERROR: "ERROR",
  UPDATE_AVAILABLE: "UPDATE_AVAILABLE"
};

window.onload = function() {
	const messageDiv = document.getElementById('message')
  ipcRenderer.send("loaded");
  ipcRenderer.on("updater", (event, { name, message }) => {
    if (name === constants.CHECKING_UPDATE) {
			messageDiv.innerText = "Checking for updates..."
		}
		if (name === constants.NO_UPDATE) {
			messageDiv.innerText = "Starting..."
		}
		if (name === constants.ERROR) {
			messageDiv.innerText = "Something went wrong. Error: \n" + message
		}
		if (name === constants.UPDATE_AVAILABLE) {
			log.log('DOWNLOAD_PROGRESS')
			messageDiv.innerText = "Downloading update..."
		}
  });
};
