const os = require("os");
const path = require("path");
const {nativeImage} = require("electron");
let iconPath;
let notificationIconPath;

if (os.type == 'Windows_NT') {
    iconPath = path.join(__dirname, '../build/icon.ico');
    notificationIconPath = path.join(__dirname, '../build/notification_icon.ico');
} else {
    iconPath = path.join(__dirname, '../build/icon.png');
    notificationIconPath = path.join(__dirname, '../build/notification_icon.png');
}
const appIcon = nativeImage.createFromPath(iconPath);
const appNotificationIcon = nativeImage.createFromPath(notificationIconPath);

module.exports = {
    appIcon,
    // status: 0 = default 1 = notification
    setAppIcon(window, tray, status) {
        window && window.setIcon(!status ? appIcon : appNotificationIcon)
        tray && tray.setImage(!status ? appIcon : appNotificationIcon)
    }
}