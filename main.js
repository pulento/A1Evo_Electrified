// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')

const appTitle = 'A1 Evo Electrified'
const path = require('node:path')
const url = require('url')
const fs = require('fs')
const dialog = require('electron').remote


const appWorkingDir = app.getPath('userData');
const tempDir = app.getPath('temp');
const sessionDir = app.getPath('sessionData');

app.setName(appTitle);
console.log(`Working directory: ${appWorkingDir}`);
console.log(`Temp directory: ${tempDir}`);
console.log(`Session directory: ${sessionDir}`);

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
    app.setName(title)
  })

  ipcMain.on("save-file", (event, file_name, contents) => {
	  fs.writeFile(path.join(__dirname, file_name), contents, err => {
      if (err) {
        console.error(`Error saving: ${file_name} - ${err}`);
      } else {
        // file written successfully
        //console.log(`Saved file: ${file_name}`)
      }
    })
  })

  ipcMain.handle('get-dirname', (event) => {
    //console.log(`Running __dirname: ${__dirname}`)
    return __dirname
  })
 
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
