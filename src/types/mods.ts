export interface IGameInfo {
  isInstalled: boolean;
  detectedLocation: string;
  version: string;
}

export interface IModItem {
  name: string;
  version: string;
  isActive: boolean;
  icon?: string;
  path?: string;
  isUpdateAvailable?: boolean;
}

export interface IModsInfo {
  "tou-mira": IModItem;
  "better-crewmates": IModItem;
}

export interface ILauncherStatus {
  status: "idle" | "loading" | "error" | "success";
  message: string;
}

export interface ISettingsInfo {
  amongUs: {
    targetVersion: string;
  };
  townOfUs: {
    targetVersion: string;
  };
  modManager: {
    enableGameVersionChange: boolean;
    enableModVersionChange: boolean;
  };
}
