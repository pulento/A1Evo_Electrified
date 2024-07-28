// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')

const appTitle = 'A1 Evo Electrified'
const path = require('node:path')
const url = require('url')
const fs = require('fs')
const dialog = require('electron').remote

const appSupportDir = app.getPath('userData');
const homeDir = app.getPath('home');
const A1EVODir = path.join(homeDir, "A1Evo");
const runDir = path.join(A1EVODir, getCurrentDateTime(true));
const mDir = "measurements";
const measDirectory = path.join(runDir, mDir);

app.setName(appTitle);
console.log(`Home directory: ${homeDir}`);
console.log(`Working directory: ${runDir}`);
console.log(`Measurement directory: ${measDirectory}`);

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

  ipcMain.on("make-dir", (event, directory) => {
	  fs.mkdir(path.join(runDir, directory), { recursive: true }, err => {
      if (err) {
        if (err.code !== "EEXIST") {
          console.error(`Error creating folder: ${directory} - ${err}`);
        } else {
          // directory exists
          console.warn(`Directory already exists: ${directory}`)
        }
      } else {
        // file written successfully
        console.log(`Folder created: ${path.join(A1EVODir, directory)}`)
      }
    })
  })

  ipcMain.handle("list-dir", (event, directory) => {
    let files = fs.readdirSync(path.join(runDir, directory), err => {
      if (err) {
        console.error(`Error reading folder: ${directory} - ${err}`);
      }
    })

    // Convert to full paths
    let mFiles = []
    for (file of files) {
      let mFile = path.resolve(measDirectory, file);
      mFiles.push(mFile)
    }
    return mFiles;
  })

  ipcMain.handle("get-date", (event, timestamp = false) => {
    return getCurrentDateTime(timestamp);
  })

  ipcMain.on("save-file", (event, file_name, contents) => {
	  fs.writeFile(path.join(runDir, file_name), contents, err => {
      if (err) {
        console.error(`Error saving: ${file_name} - ${err}`);
      }
    })
  })

  ipcMain.on("save-measurement", (event, file_name, contents) => {
	  fs.writeFile(path.join(measDirectory, file_name), contents, err => {
      if (err) {
        console.error(`Error saving: ${file_name} - ${err}`);
      }
    })
  })

  ipcMain.handle('get-mdirname', (event) => {
    return measDirectory;
  })
 
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

}

// Return current date in readeable format or timestamp
function getCurrentDateTime(timestamp = false) {
  const now = new Date();
  if (!timestamp) {
    return now.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
  } else {
    // obtain TZ offset
    tzOffset = now.getTimezoneOffset() * 60000;
    let localTS = new Date(now - tzOffset);
    return localTS.toISOString().replace(/[^\d]/g,'').slice(0, -3);
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  console.log("Starting REW ...");
  if (process.platform == 'darwin') {
    let spawn = require("child_process").spawn;
    let rew = spawn("open", ["-a", "REW.app", "--args", "-api"]);
    
    rew.stderr.on("data", (err) => {
      console.error(err);
    });
  } else {
    let spawn = require("child_process").spawn;
    let rew = spawn("C:\\Program Files\\REW\\roomeqwizard.exe", ["-api"]);
    
    rew.stderr.on("data", (err) => {
      console.error(err);
    });
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow();
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
