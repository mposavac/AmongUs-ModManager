import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { IModItem } from "../types/mods";

const getBetterCrewInfo = () => {
  try {
    const bclPath = path.join(
      process.env.LOCALAPPDATA,
      "Programs",
      "bettercrewlink",
      "Better-CrewLink.exe",
    );
    const command = `powershell -command "(Get-Item '${bclPath}').VersionInfo.ProductVersion"`;
    const version = execSync(command).toString().trim();
    const modData: Partial<IModItem> = {
      isActive: fs.existsSync(bclPath),
      version,
    };
    return modData;
  } catch (e) {
    console.error("Could not find BetterCrew in Registry", e);
  }
  return null;
};

export const findBetterCrew = () => {
  const betterCrewData = getBetterCrewInfo();
  if (!betterCrewData) return null;
  return betterCrewData;
};
