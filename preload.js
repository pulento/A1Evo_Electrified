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

const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  saveFile: (filename, data) => ipcRenderer.send('save-file', filename, data),
  checkFile: async (filename) => await ipcRenderer.invoke('check-file', filename),
  saveMeasurement: (filename, data) => ipcRenderer.send('save-measurement', filename, data),
  createRunDir: (directory) => ipcRenderer.invoke('make-run-dir', directory),
  getMDirname: () => ipcRenderer.invoke('get-mdirname'),
  getConfigKey: async (key) => await ipcRenderer.invoke('get-config-key', key),
  setConfigKey: async (key, value) => await ipcRenderer.invoke('set-config-key', key, value),
  delConfigKey: async (key) => await ipcRenderer.invoke('delete-config-key', key),
  listDir: (directory) => ipcRenderer.invoke('list-dir', directory),
  getDate: (timestamp = false) => ipcRenderer.invoke('get-date', timestamp),
  openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config),
  getDir: (dir) => ipcRenderer.invoke('get-dir', dir),
  getVersion: () => ipcRenderer.invoke('get-version'),
  showErrorDialog: (title, message) => ipcRenderer.invoke('show-error-box', title, message),
  showRestartDialog: (restartmessage) => ipcRenderer.invoke('show-restart-box', restartmessage),
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
