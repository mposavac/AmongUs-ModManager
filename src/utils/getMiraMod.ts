import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { IModItem } from "../types/mods";
import { getAmongUsLocation } from "./getAmongUs";

const getMiraModnfo = async () => {
  try {
    const gamePath = await getAmongUsLocation();
    if (!gamePath) {
      throw "Among us not found";
    }
    const modDllPath = path.join(
      gamePath,
      "BepInEx",
      "plugins",
      "TownOfUsMira.dll",
    );
    const command = `powershell -command "(Get-Item '${modDllPath}').VersionInfo.ProductVersion"`;
    const version = execSync(command).toString().trim();
    const modData: Partial<IModItem> = {
      isActive: fs.existsSync(modDllPath),
      version,
    };

    return modData;
  } catch (e) {
    console.error("Could not find BetterCrew in Registry", e);
  }
  return null;
};

export const getMiraMod = async () => {
  const miraModData = await getMiraModnfo();
  if (!miraModData) return null;
  return miraModData;
};
