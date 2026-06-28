import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { IGameInfo } from "../types/mods";

export const getSteamPath = () => {
  try {
    // Query the registry for the Steam InstallPath
    const buffer = execSync(
      'reg query "HKCU\\Software\\Valve\\Steam" /v SteamPath',
    );
    const output = buffer.toString();

    // The output looks like: SteamPath    REG_SZ    C:/Program Files (x86)/Steam
    // We use a regex to grab the actual path
    const match = output.match(/REG_SZ\s+(.*)/);
    if (match && match[1]) {
      return match[1].trim().replace(/\//g, path.sep);
    }
  } catch (e) {
    console.error("Could not find Steam in Registry", e);
  }
  return null;
};

export const getAmongUsLocation = async (): Promise<IGameInfo | null> => {
  const steamPath = getSteamPath();
  if (!steamPath) return null;

  const getGameVersion = (gamePath: string) => {
    const steamPath = path.resolve(gamePath, "..", "..", "..");
    const manifestPath = path.join(
      steamPath,
      "steamapps",
      "appmanifest_945360.acf",
    );
    const manifestContent = fs.readFileSync(manifestPath, "utf8");

    const userConfigMatch = manifestContent.match(
      /"UserConfig"\s*\{[\s\S]*?\}/,
    );
    return userConfigMatch
      ? (userConfigMatch[0].match(/"BetaKey"\s+"([^"]+)"/) || [])[1] || "public"
      : "public";
  };

  // Check default location first
  const defaultPath = path.join(steamPath, "steamapps", "common", "Among Us");
  if (fs.existsSync(defaultPath)) {
    const data: IGameInfo = {
      isInstalled: true,
      detectedLocation: defaultPath,
      version: getGameVersion(defaultPath),
    };
    return data;
  }

  // Check other libraries
  const vdfPath = path.join(steamPath, "steamapps", "libraryfolders.vdf");
  if (fs.existsSync(vdfPath)) {
    const vdfContent = fs.readFileSync(vdfPath, "utf-8");

    // Simple regex to find all "path" values in the VDF file
    const pathRegex = /"path"\s+"([^"]+)"/g;
    let match;

    while ((match = pathRegex.exec(vdfContent)) !== null) {
      const libraryPath = match[1].replace(/\\\\/g, "\\");
      const gamePath = path.join(
        libraryPath,
        "steamapps",
        "common",
        "Among Us",
      );

      if (fs.existsSync(gamePath)) {
        const data: IGameInfo = {
          isInstalled: true,
          detectedLocation: gamePath,
          version: getGameVersion(gamePath),
        };
        return data;
      }
    }
  }

  return null;
};
