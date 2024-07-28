/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  saveFile: (filename, data) => ipcRenderer.send('save-file', filename, data),
  saveMeasurement: (filename, data) => ipcRenderer.send('save-measurement', filename, data),
  createDir: (directory) => ipcRenderer.send('make-dir', directory),
  getMDirname: () => ipcRenderer.invoke('get-mdirname'),
  listDir: (directory) => ipcRenderer.invoke('list-dir', directory),
  getDate: (timestamp = false) => ipcRenderer.invoke('get-date', timestamp)

})

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
