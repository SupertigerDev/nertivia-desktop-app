const actionDiv = document.getElementById("action");

window.api.receive("skip_update", reason => {
	actionDiv.innerHTML = "Skipping update.<br> Reason: " + reason;
	closeUpdater(2000);
});
window.api.receive("update_available", reason => {
	actionDiv.innerHTML = "Updating Nertivia...";
	closeUpdater(2000);
});

window.api.send("check_update");


function closeUpdater(delay = 0) {
	setTimeout(() => {
		window.api.send("close_updater");
	}, delay);
}