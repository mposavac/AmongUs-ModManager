import { IModItem } from "./mods";

declare global {
  interface Window {
    electronAPI: {
      findAmongUs: () => Promise<IGameInfo | null>;
      findBetterCrew: () => Promise<IModItem | null>;
      findMiraMod: () => Promise<IModItem | null>;
      installLatestMod: (
        path: string,
        modVersion: string,
      ) => Promise<{ success: boolean }>;
      openExternal: (url: string) => Promise<void>;
      cleanInstall: (
        gamePath: string,
        gameVersion: string,
        modVersion: string,
      ) => Promise<void>;
      launchGame: () => Promise<void>;
      onCleanStatusUpdate: (callback: (message: string) => void) => void;
      onVersionStatusChange: (
        callback: (name: string, data: IModItem) => void,
      ) => void;
    };
  }
}

export {};
