import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { getAmongUsLocation } from "./utils/getAmongUs";
import { intallLatestMod } from "./utils/intallLatestMod";
import { findBetterCrew } from "./utils/getBetterCrew";
import { cleanInstall } from "./utils/cleanInstall";
import { getMiraMod } from "./utils/getMiraMod";
import { launchGame } from "./utils/launchGame";
import { updateElectronApp, UpdateSourceType } from "update-electron-app";

// Declare global Vite-injected variables
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

updateElectronApp({
  updateSource: {
    host: "https://github.com/",
    type: UpdateSourceType.ElectronPublicUpdateService,
    repo: "mposavac/AmongUs-ModManager",
  },
  updateInterval: "1 hour",
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    alwaysOnTop: true,
    fullscreenable: false,
    resizable: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets/img/logo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("locate-game", async () => {
  const path = getAmongUsLocation();
  return path;
});

ipcMain.handle("locate-mira-mod", async () => {
  const data = getMiraMod();
  return data;
});

ipcMain.handle("locate-better-crew", async () => {
  const data = findBetterCrew();
  return data;
});

ipcMain.handle("open-external", async (_, url) => {
  shell.openExternal(url);
});

ipcMain.handle("clean-install", async (event, gamePath) => {
  await cleanInstall(event, gamePath);
});

ipcMain.handle("install-mod", async (event, gamePath) => {
  intallLatestMod(event, gamePath);
});

ipcMain.handle("launch-game", async () => {
  launchGame();
});
