const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, 'src', 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    })
    win.loadFile(path.join(__dirname, 'src', 'index.html'))

    win.setMenuBarVisibility(false)

    // handle file open dialog request from renderer
    ipcMain.handle('dialog:openFile', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(win, {
            filters: [{
                name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'flac']
            }],
            properties: ['openFile'],
        });
        if (canceled) {
            return null;
        } else {
            return filePaths[0];
        }
    })
}

app.whenReady().then(() => {
    createWindow()
})