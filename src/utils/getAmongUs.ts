import { execSync } from "child_process";
import path from "path";
import fs from "fs";

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

export const getAmongUsLocation = async () => {
  const steamPath = getSteamPath();
  if (!steamPath) return null;

  // Check default location first
  const defaultPath = path.join(steamPath, "steamapps", "common", "Among Us");
  if (fs.existsSync(defaultPath)) return defaultPath;

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
        return gamePath;
      }
    }
  }

  return null;
};
