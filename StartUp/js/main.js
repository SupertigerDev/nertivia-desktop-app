const { ipcRenderer } = require("electron");
const log = require('electron-log');

const constants = {
	CHECKING_UPDATE: "CHECKING_UPDATE",
	NO_UPDATE: "NO_UPDATE",
	ERROR: "ERROR",
	UPDATE_AVAILABLE: "UPDATE_AVAILABLE"
};

let errorInterval;

window.onload = function () {
	const messageDiv = document.getElementById('message')
	ipcRenderer.send("updater_window_loaded");
	ipcRenderer.on("updater", (event, { name, message }) => {
		if (name === constants.CHECKING_UPDATE) {
			messageDiv.innerText = "Checking for updates..."
		}
		if (name === constants.NO_UPDATE) {
			messageDiv.innerText = "Starting..."
		}
		if (name === constants.ERROR) {
			let timer = 5;
			messageDiv.innerHTML = `<div class="top-error">Something went wrong. Error:</div>\n${message}\n\n <div class='retry-countdown'>Retrying in ${timer}</div>`
			errorInterval = setInterval(function() {
				if (timer === 0) {
					ipcRenderer.send("updater_window_loaded");
					clearInterval(errorInterval);
					return;
				}
				document.querySelector('.retry-countdown').innerHTML
				timer -= 1;
				messageDiv.innerHTML = `<div class="top-error">Something went wrong. Error:</div>\n${message}\n\n <div class='retry-countdown'>Retrying in ${timer}</div>`
			}, 1000);

		}
		if (name === constants.UPDATE_AVAILABLE) {
			log.log('DOWNLOAD_PROGRESS')
			messageDiv.innerText = "Downloading update..."
		}
	});
};

