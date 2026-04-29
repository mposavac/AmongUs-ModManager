import path from "path";
import { exec, execSync } from "child_process";
import { BrowserWindow } from "electron";

export const launchGame = async () => {
  console.log("TEST");
  const bclPath = path.join(
    process.env.LOCALAPPDATA,
    "Programs",
    "bettercrewlink",
    "Better-CrewLink.exe",
  );
  try {
    exec(`"${bclPath}"`, (error) => {
      if (error) {
        execSync("start steam://launch/945360");
        const win = BrowserWindow.getFocusedWindow();
        if (win) win.minimize();

        console.error(`Launch error: ${error}`);
      }
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
