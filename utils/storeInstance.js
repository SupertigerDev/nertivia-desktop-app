const Store = require('electron-store');
const store = new Store();

module.exports = {
    store,
    startup: {
        enabled:() => store.get("startup.enabled", true),
        minimized:() => store.get("startup.minimized", true),
    }
};