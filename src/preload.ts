// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { IModItem } from "./types/mods";

contextBridge.exposeInMainWorld("electronAPI", {
  findAmongUs: () => ipcRenderer.invoke("locate-game"),
  findBetterCrew: () => ipcRenderer.invoke("locate-better-crew"),
  findMiraMod: () => ipcRenderer.invoke("locate-mira-mod"),
  installLatestMod: (path: string, modVersion: string) =>
    ipcRenderer.invoke("install-mod", path, modVersion),
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
  cleanInstall: (gamePath: string, gameVersion: string, modVersion: string) =>
    ipcRenderer.invoke("clean-install", gamePath, gameVersion, modVersion),
  launchGame: () => ipcRenderer.invoke("launch-game"),
  onCleanStatusUpdate: (callback: (message: string) => void) =>
    ipcRenderer.on("clean-install-status", (_, value) => callback(value)),
  onVersionStatusChange: (callback: (type: string, data: IModItem) => void) =>
    ipcRenderer.on("mod-version-change", (_, value) =>
      callback(value.name, value.data),
    ),
});
