import { ILauncherStatus, IModItem, IModsInfo } from "../types/mods";

export const miraModDefault: IModItem = {
  name: "Town of Us - Mira",
  version: "Not installed",
  isActive: false,
  icon: "https://raw.githubusercontent.com/AU-Avengers/TOU-Mira/main/Images/Logo.png",
};

export const betterCrewDefault: IModItem = {
  name: "BetterCrewmates",
  version: "Not installed",
  isActive: false,
  icon: "https://raw.githubusercontent.com/OhMyGuus/BetterCrewLink/nightly/static/images/logos/sizes/256-BCL-Logo-shadow.png",
};

export const mockInstalledMods: IModsInfo = {
  "tou-mira": miraModDefault,
  "better-crewmates": betterCrewDefault,
};

export const mockLauncherStatus: ILauncherStatus = {
  status: "idle",
  message: "Idle. Game path detected successfully.",
};
