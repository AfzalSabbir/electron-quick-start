// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const windowStateKeeper             = require('electron-window-state')
const readItem                      = require('./readItem')

let mainWindow;

ipcMain.on('add-item', (event, itemUrl) => {
    readItem(itemUrl, item => {
        event.sender.send('item-added', item)
    });
})

function createWindow() {
    // win state keeper
    const state = windowStateKeeper({
        defaultWidth : 650,
        defaultHeight: 500,
    })

    // Create the browser window.
    mainWindow = new BrowserWindow({
        x        : state.x,
        y        : state.y,
        width    : state.width,
        height   : state.height,
        minWidth : 350,
        minHeight: 300,
        /*maxWidth      : 900,*/
        webPreferences: {
            contextIsolation: false,
            nodeIntegration : true,
        },
    })

    // and load the index.html of the app.
    mainWindow.loadFile('./renderer/main.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Managing window state
    state.manage(mainWindow)

    // Listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
