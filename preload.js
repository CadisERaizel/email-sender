// preload.js

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })

  const { contextBridge, ipcRenderer } = require('electron')

  contextBridge.exposeInMainWorld('electronAPI', {
    users: () => ipcRenderer.invoke('get-users').then(result => result)
  })

  const { remote } = require('electron');

  function minimize() {
    const window = remote.getCurrentWindow();
    window.minimize();
  }
  
  function maximize() {
    const window = remote.getCurrentWindow();
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
  
  function closeWindow() {
    const window = remote.getCurrentWindow();
    window.close();
  }
  