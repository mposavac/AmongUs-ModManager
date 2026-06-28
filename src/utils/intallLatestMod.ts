import axios from "axios";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { app } from "electron";
import { sendMessage } from "./sendMessage";
import { getMiraMod } from "./getMiraMod";
import { IModItem } from "../types/mods";
import { getModVersionData } from "./getModVersionData";

interface Asset {
  name: string;
  browser_download_url: string;
}

export const intallLatestMod = async (
  event: any,
  gamePath: string,
  modVersion: string,
) => {
  const tempZipPath = path.join(app.getPath("downloads"), "mod-download.zip");

  try {
    // Get the download URL from GitHub API
    const latestRelease = await getModVersionData(modVersion);

    const downloadUrl = latestRelease?.assets.find((asset: Asset) =>
      asset.name.includes("steam-itch.zip"),
    )?.browser_download_url;

    // Download the mod file
    const response = await axios.get(downloadUrl, {
      responseType: "arraybuffer",
    });
    fs.writeFileSync(tempZipPath, response.data);

    // Smart Unzip Logic
    sendMessage(
      event,
      "clean-install-status",
      `Intalling the mod (version ${latestRelease?.name})...`,
    );
    const zip = new AdmZip(tempZipPath);
    const zipEntries = zip.getEntries(); // Get all files/folders in zip

    // Find the first folder entry (the one you don't know the name of)
    // Usually, the first entry is the root folder
    const rootFolderName = zipEntries[0].entryName.split("/")[0];

    zipEntries.forEach((entry) => {
      // Check if the file is inside that root folder
      if (entry.entryName.startsWith(rootFolderName + "/")) {
        // Strip the root folder name from the path
        const targetPath = entry.entryName.replace(rootFolderName + "/", "");

        if (targetPath.length > 0) {
          // Ensure it's not the folder itself
          if (entry.isDirectory) {
            const dirToCreate = path.join(gamePath, targetPath);
            if (!fs.existsSync(dirToCreate))
              fs.mkdirSync(dirToCreate, { recursive: true });
          } else {
            // Extract the file manually to the game folder
            const targetFile = path.join(gamePath, targetPath);
            fs.writeFileSync(targetFile, entry.getData());
          }
        }
      }
    });
    sendMessage(
      event,
      "clean-install-status",
      `Mod successfully installed (version ${latestRelease?.name})...`,
    );
    const modData: Partial<IModItem> | null = await getMiraMod();
    if (!modData) {
      throw "Not installed";
    }
    sendMessage(event, "mod-version-change", {
      name: "tou-mira",
      data: modData,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  } finally {
    // Delete temp file
    if (fs.existsSync(tempZipPath)) {
      try {
        fs.unlinkSync(tempZipPath);
      } catch (err) {
        console.error("Failed to delete temp ZIP:", err);
      }
    }
  }
};
