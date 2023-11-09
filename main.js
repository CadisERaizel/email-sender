const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const Store = require("electron-store");
const { spawn } = require("child_process");
const process = require('node:process');

const store = new Store();

var devProc

function getUsers(e) {
  let userAccounts;
  if (store.has("userAccounts")) {
    userAccounts = store.get("userAccounts");
    console.log("The key exists in the store.");
  } else {
    userAccounts = store.set("userAccounts", []);
    console.log("The key does not exist in the store.");
  }
  return userAccounts;
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "Email Sender",
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  //load the index.html from a url
  mainWindow.loadURL("http://localhost:3000");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("get-users", getUsers);
  createWindow();

  devProc = spawn("sh ./run_server.sh", {
    detached: true,
    shell: true,
  });
  var scriptOutput = "";
  devProc.stdout.setEncoding("utf8");
  devProc.stdout.on("data", function (data) {
    console.log("stdout: " + data);

    data = data.toString();
    scriptOutput += data;
  });

  devProc.stderr.setEncoding("utf8");
  devProc.stderr.on("data", function (data) {
    console.log("stderr: " + data);

    data = data.toString();
    scriptOutput += data;
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
