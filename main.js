const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const Store = require("electron-store");
const { spawn } = require("child_process");
const process = require('node:process');
const isDevMode = require("electron-is-dev");
const kill = require('tree-kill');

let userAccounts;
const store = new Store()
var devProc

const backendFolder = path.resolve(__dirname, 'backend');

ipcMain.on('fetch-user-accounts', (event, data) => {
  if (store.has('userAccounts')) {
    userAccounts = store.get('userAccounts');
  } else {
    userAccounts = []
    store.set('userAccounts', []);
  }
  event.reply('send-user-accounts', userAccounts);
});


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
    width: 1360,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
    },
  });

  if (isDevMode) {
    mainWindow.loadURL("http://localhost:3000");

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {

    mainWindow.loadFile(path.join(__dirname, "build/index.html"));
  }

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("get-users", getUsers);
  createWindow();
  if (isDevMode) {
    if (process.platform === 'win32') {
      devProc = spawn(`uvicorn main:app --host 0.0.0.0 --port 55555 --reload`, {
        detached: true,
        shell: true,
        cwd: backendFolder
      });
    } else {
      devProc = spawn("sh ./run_server.sh", {
        detached: true,
        shell: true,
      });
    }
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
  } else {
    // Dynamic script assignment for starting Python in production
    const runPython = {
      darwin: `open -gj "${path.join(app.getAppPath(), "resources", "app.app")}" --args`,
      linux: "./resources/main/main",
      win32: `powershell -Command Start-Process -WindowStyle Hidden "./resources/main/main.exe"`,
    }[process.platform];

    devProc = spawn(`${runPython}`, {
      shell: true,
    });
  }

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', function () {
  kill(devProc.pid)
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
