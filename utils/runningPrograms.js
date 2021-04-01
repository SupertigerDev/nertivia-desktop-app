const { getWindows } = require("active-window-listener");

module.exports = async function getAllRunningPrograms(storedPrograms = []) {
    const windows = getWindows();
    const map = await Promise.all(
      windows.map(async window => {
        const filename = window.path.split("\\")[
          window.path.split("\\").length - 1
        ];
        if (storedPrograms.find(sp => sp.filename === filename))
          return undefined;
        let title;
        try {
          const exif = await window.getExif();
          if (exif.FileDescription && exif.FileDescription.trim().length) {
            title = exif.FileDescription;
          } else if (exif.ProductName && exif.ProductName.trim().length) {
            title = exif.ProductName;
          } else {
            title = window.getTitle();
          }
        } catch {
          title = window.getTitle();
        }
        return { name: title, filename };
      })
    );
    const filter = map.filter(w => w !== undefined);
    return filter;
  }