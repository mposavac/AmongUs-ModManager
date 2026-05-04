import { execSync } from "child_process";

export const checkSteam = async () => {
  try {
    const stdout = execSync(
      'tasklist /FI "IMAGENAME eq Steam.exe" /NH',
    ).toString();

    return stdout.toLowerCase().includes("steam.exe");
  } catch (error) {
    return false;
  }
};
