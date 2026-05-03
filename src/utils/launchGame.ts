import path from "path";
import { exec, execSync } from "child_process";
import { BrowserWindow } from "electron";

export const launchGame = async () => {
  const bclPath = path.join(
    process.env.LOCALAPPDATA,
    "Programs",
    "bettercrewlink",
    "Better-CrewLink.exe",
  );
  try {
    exec(`"${bclPath}"`);
    execSync("start steam://launch/945360");
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.minimize();

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
