import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { sendMessage } from "./sendMessage";
import { intallLatestMod } from "./intallLatestMod";
import { miraModDefault } from "./mockData";
import { checkSteam } from "./checkSteam";

export const cleanInstall = async (event: unknown, gamePath: string) => {
  try {
    const steamPath = path.resolve(gamePath, "..", "..", "..");
    const isSteamRunning = await checkSteam();
    if (!isSteamRunning) {
      execSync("start steam://start");
      sendMessage(event, "clean-install-status", "Checking steam...");
      await new Promise<void>((resolve) => {
        const checkInterval = setInterval(async () => {
          const isSteamRunning = await checkSteam();
          if (isSteamRunning) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 5000);
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
    sendMessage(event, "clean-install-status", "Closing steam...");
    console.log("Closing Steam...");
    execSync("start steam://exit");

    // Give Steam 3 seconds to actually release file locks
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Delete all Among Us files
    if (fs.existsSync(gamePath)) {
      console.log("Deleting game files...");
      sendMessage(event, "clean-install-status", "Deleting game files...");
      fs.rmSync(gamePath, { recursive: true, force: true });
      // Re-create empty folder so Steam doesn't get confused
      fs.mkdirSync(gamePath, { recursive: true });
    }
    sendMessage(event, "mod-version-change", {
      name: "tou-mira",
      data: miraModDefault,
    });
    // Edit appmanifest_945360.acf to force "public" branch
    const manifestPath = path.join(
      steamPath,
      "steamapps",
      "appmanifest_945360.acf",
    );

    if (fs.existsSync(manifestPath)) {
      console.log("Resetting manifest to public branch...");
      sendMessage(
        event,
        "clean-install-status",
        "Resetting manifest to public branch...",
      );

      const content = fs.readFileSync(manifestPath, "utf8");

      // Use Regex to find the UserConfig section and replace BetaKey
      // This looks for "BetaKey" and whatever follows it, replacing it with "public"
      const updatedContent = content.replace(
        /"UserConfig"\s*\{[\s\S]*?\}/,
        `"UserConfig"\n\t{\n\t\t"language"\t\t"english"\n\t\t"BetaKey"\t\t"public"\n\t}`,
      );

      fs.writeFileSync(manifestPath, updatedContent);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Run Steam Validation
    console.log("Starting Steam Validation...");
    sendMessage(event, "clean-install-status", "Starting Steam Validation...");

    execSync("start steam://validate/945360");

    // Wait for Validation & Install Mod
    // Since we can't 'wait' for Steam's UI, we check for Among Us.exe
    // to reappear. We will check every 5 seconds for up to 5 minutes.
    const exePath = path.join(gamePath, "Among Us.exe");

    const waitForGameAndInstall = setInterval(async () => {
      if (fs.existsSync(exePath)) {
        console.log("Among Us restored. Installing mod...");
        sendMessage(
          event,
          "clean-install-status",
          "Among Us restored. Downloading latest mod version...",
        );
        clearInterval(waitForGameAndInstall);
        await intallLatestMod(event, gamePath);
        return true;
      }
    }, 5000);
  } catch (error) {
    console.error("Clean install failed:", error);
    throw error;
  }
};
