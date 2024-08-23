/* 
  Copyright (c) [2024] [Pulento - https://github.com/pulento]

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, and to permit persons to
  whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

  Redistribution and use in source and binary forms, with or without
  modification, are not permitted for commercial purposes without the explicit
  permission of the author.
*/

import { app, BrowserWindow, ipcMain, Menu, dialog, shell } from 'electron';
import Store from 'electron-store';

const appTitle = 'A1 Evo Electrified'
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prefStore = new Store();

const appDir = app.getAppPath();
const userDataDir = app.getPath('userData');
const homeDir = app.getPath('home');

// Sets default working directory
let A1EVODir = "";
const workDir = prefStore.get("workdirectory");
if (!workDir || workDir === "A1Evo") {
  A1EVODir = path.join(homeDir, "A1Evo");
  prefStore.set("workdirectory",A1EVODir);
} else {
  A1EVODir = workDir;
}

let runDir = path.join(A1EVODir, getCurrentDateTime(true));
const mDir = "measurements";
let measDirectory = path.join(runDir, mDir);
const targetCurveDir = path.join(appDir.replace('app.asar',''), 'targetcurves');
const isMac = process.platform === 'darwin';
const isWindows = process.platform == 'win32';
const A1EEVersion = app.getVersion();
const browserWindows = [];
let mainWindow;

const menuTemplate = [
  // { role: 'appMenu' }
  ...(isMac
    ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { label: 'Settings', accelerator: 'Cmd+,', click: openSettings },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      ...(isMac
        ? [ { role: 'quit' } ]
        : [ { label: 'Settings', accelerator: 'Ctrl+,', click: openSettings },
            { role: 'quit' } ]
    )]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' }
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ]
        : [
            { role: 'close' }
          ])
    ]
  },
  {
    role: 'help',
    submenu: [
      { role: 'about' },
      { label: 'Learn More',
        click: async () => {
          await shell.openExternal('https://www.youtube.com/watch?v=lmZ5yV1-wMI')
      }}
    ]
  }
]

// Squirrel nightmare to just install/uninstall a shortcut on Windows
var squirrelCommand = process.argv[1];
const appFolder = path.resolve(process.execPath, '..');
const rootAtomFolder = path.resolve(appFolder, '..');
const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
const exeName = path.basename(process.execPath);

switch (squirrelCommand) {
  case '--squirrel-install':
  case '--squirrel-updated':
    console.log(`Install process..`);
    spawn(updateDotExe, ['--createShortcut', exeName]);
    prefStore.set("targetcurve", "");
    setTimeout(app.quit, 1000);

  case '--squirrel-uninstall':
    // Remove desktop and start menu shortcuts
    console.log(`Uninstall process..`);
    spawn(updateDotExe,['--removeShortcut', exeName]);
    prefStore.set("targetcurve", "");
    setTimeout(app.quit, 1000);

  app.quit();
}

app.setName(appTitle);
console.log(`App directory: ${appDir}`);
console.log(`Home directory: ${homeDir}`);
console.log(`Working directory: ${runDir}`);
console.log(`Measurement directory: ${measDirectory}`);
console.log(`User data directory: ${userDataDir}`);
console.log(`Target curves directory: ${targetCurveDir}`);

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
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

  ipcMain.handle("make-run-dir", (event, directory) => {
    // Update runnning and measurement directory
    runDir = path.join(A1EVODir, getCurrentDateTime(true));
    measDirectory = path.join(runDir, mDir);
	  fs.mkdirSync(path.join(runDir, directory), { recursive: true }, err => {
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
    let files, err;
    try {
        files = fs.readdirSync(path.join(runDir, directory), err => {
        if (err) {
          console.error(`Error reading folder ${directory} - ${err}`);
          return {undefined, err};
        }
      })
    } catch(err) {
      console.error(`Error reading folder - ${err}`);
      return {undefined, err};
    }

    // Convert to full paths
    let mFiles = []
    for (let file of files) {
      let mFile = path.resolve(measDirectory, file);
      mFiles.push(mFile)
    }
    return {mFiles, err};
  })

  ipcMain.handle("get-date", (event, timestamp = false) => {
    return getCurrentDateTime(timestamp);
  })

  ipcMain.on("save-file", (event, file_name, contents) => {
    try {
      fs.writeFileSync(path.join(runDir, file_name), contents, err => {
        if (err) {
          console.error(`Error saving: ${file_name} - ${err}`);
        }
      })
    } catch(err) {
      console.error(`Error saving: ${file_name} - ${err}`);
    }
  })

  ipcMain.handle("check-file", (event, file_name) => {
    let tcFile = false;
    try {
      tcFile = fs.statSync(file_name, (err, stats) => {
        console.log(`Checking ${file_name}`);
        if (err) {
          console.error(`Error checking file: ${file_name} - ${err}`);
          return false;
        } else {
          console.log(stats);
          if (stats.isFile()) {
            return true;
          } else {
            return false;
          }
        }
      });
    } catch(err) {
      console.error(`Error checking file. ${err}`);
      return false;
    }
    return tcFile;
  })

  ipcMain.on("save-measurement", (event, file_name, contents) => {
    try {
      fs.writeFileSync(path.join(measDirectory, file_name), contents, err => {
        if (err) {
          console.error(`Error saving: ${file_name} - ${err}`);
        }
      })
    } catch(err) {
      console.error(`Error saving: ${file_name} - ${err}`);
    }
  })

  ipcMain.handle('get-version', (event) => {
    return A1EEVersion;
  })

  ipcMain.handle('get-dir', (event, dir) => {
    switch (dir) {
      case "targetcurve":
        return targetCurveDir;
      case "home":
        return homeDir;
      case "measurements":
        return measDirectory;
    }
  })

  ipcMain.handle('get-config-key', (event, key) => {
    return prefStore.get(key);
  })

  ipcMain.handle('set-config-key', (event, key, value) => {
    console.log(`Set default ${key} to ${value}`);
    prefStore.set(key, value);
    
  })

  ipcMain.handle('delete-config-key', (event, key) => {
    console.log(`Delete ${key}`);
    prefStore.delete(key);
    
  })

  ipcMain.handle('dialog', async (event, method, params) => {    
    const filePath = await dialog[method](params);
    //console.log(filePath[0]);
    if (filePath)
      return filePath[0];
    else
      return "";
  })

  ipcMain.handle('show-error-box', (event, title, message) => {
    dialog.showErrorBox(title, message);
    mainWindow.reload();
  })

  ipcMain.handle('show-restart-box', (event, restartmessage) => {
    dialog.showMessageBoxSync(mainWindow,{ message: restartmessage, type: "warning", buttons: ["OK"]});
    app.relaunch();
    app.quit();
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
    let tzOffset = now.getTimezoneOffset() * 60000;
    let localTS = new Date(now - tzOffset);
    return (localTS.toISOString().replace(/[^\d]/g,'').slice(0, -3)).slice(0,12);
  }
}

function openSettings(menuItem, browserWindow, event) {
  console.log('Settings invoked');

  if (BrowserWindow.getAllWindows().length <= 1) {
    // Create the settings window.
    const settingsWindow = new BrowserWindow({
      show: false,
      width: 1100,
      height: 520,
      parent: mainWindow,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      }
    });

    settingsWindow.removeMenu();
    
    settingsWindow.once('ready-to-show', () => {
      settingsWindow.show();
    });

    settingsWindow.loadFile('settings.html')
  }
}

// Create default preferences
function createDefaultConf() {
  prefStore.store = {
    "version": app.getVersion(),
    "workdirectory": A1EVODir,
    "forceMLP": false,
    "forceSmall": false,
    "forceWeak": false,
    "forceCentre": false,
    "forceLarge": false,
    "noInversion": false,
    "limitLPF": false,
    "endFrequency": 250,
    "maxBoost": 0,
    "omaxBoost": 0,
    "targetcurve": "",
    "XO": { "BDL": [], "C": [], "CH": [], "FDL": [], "FHL": [], "FL": [], "FWL": [], "RHL": [],
            "SBL": [], "SDL": [], "SLA": [], "SHL": [], "TFL": [], "TML": [], "TRL": [], "TS": [], },
  };
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  // Menu
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  console.log("Starting REW ...");

  let confVersion = prefStore.get('version');
  if (!confVersion) {
    console.log('Creating default preferences');
    createDefaultConf();
  } else {
    console.log(`Config Version: ${confVersion}`);
  }

  if (isMac) {
    let plutil = spawn("plutil", ["-replace", '/.room eq wizard/.dropsmallfilters', "-string", "false", homeDir + "/Library/Preferences/com.apple.java.util.prefs.plist"]);
    plutil.stderr.on("data", (err) => {
      console.error(err);
    });
    plutil.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    plutil.on('close', (code) => {
      if (code == 0)
        console.log(`REW preferences set.`);
      else
        console.warn('Something went wrong setting REW preferences, check "Drop filters is gain is small" on Eq section to be unchecked.')
    }); 

    console.log("Starting REW.")
    let rew = spawn("open", ["-a", "REW.app", "--args", "-api"]);
    rew.stderr.on("data", (err) => {
      console.error(err);
    });
  } else {
    console.log("Starting REW.")
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
