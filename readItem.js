const {BrowserWindow} = require('electron');

let offscreenWindow;

module.exports = (url, callback) => {
    offscreenWindow = new BrowserWindow({
        width: 400, height: 400, show: false, webPreferences: {
            offscreen: true,
        },
    });

    offscreenWindow.loadURL(url);

    offscreenWindow.webContents.on('did-stop-loading', async () => {
        let title = offscreenWindow.getTitle();

        // offscreenWindow capturePage
        offscreenWindow.webContents.capturePage().then(image => {
            let screenShot = image.toDataURL();

            callback({title, screenShot, url});

            offscreenWindow.close();
            offscreenWindow = null;
        });
    })
}