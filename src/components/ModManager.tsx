import React, { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { GameInfo } from "./ui/GameInfo";
import { InstalledMods } from "./ui/InstalledMods";
import {
  betterCrewDefault,
  miraModDefault,
  mockLauncherStatus,
} from "../utils/mockData";
import styles from "./ModManager.module.css";
import { IGameInfo, IModItem, IModsInfo } from "../types/mods";
import {
  FaMicrophone,
  GiBroom,
  GrUpdate,
  TbBrandAmongUs,
} from "../icons/icons";
import logo from "../assets/img/logo.png";
import packageJson from "../../package.json";

export const ModManager: React.FC = () => {
  const [status, setStatus] = useState(mockLauncherStatus);
  const [gameInfo, setGameInfo] = useState<IGameInfo | null>(null);
  const [installedMods, setInstalledMods] = useState<IModsInfo | null>(null);

  useEffect(() => {
    const getGameInfo = async () => {
      const gamePath = await window.electronAPI.findAmongUs();
      setGameInfo({
        isInstalled: !!gamePath,
        detectedLocation: gamePath || "",
        version: "123",
      });
    };
    getGameInfo();
  }, []);

  useEffect(() => {
    const getModsInfo = async () => {
      const betterCrewData: IModItem =
        await window.electronAPI.findBetterCrew();
      const miraModData: IModItem = await window.electronAPI.findMiraMod();
      setInstalledMods({
        "better-crewmates": {
          ...betterCrewDefault,
          ...betterCrewData,
        },
        "tou-mira": {
          ...miraModDefault,
          ...miraModData,
        },
      });
    };
    getModsInfo();
  }, []);

  useEffect(() => {
    window.electronAPI.onCleanStatusUpdate((message: string) => {
      setStatus({ message, status: "loading" });
    });
    window.electronAPI.onVersionStatusChange(
      (modName: "tou-mira" | "better-crewmates", modData: IModItem) => {
        console.log(modName, modData);
        setInstalledMods((curr) => ({
          ...curr,
          [modName]: { ...curr[modName], ...modData },
        }));
      },
    );
  }, []);

  const handleCleanInstall = async () => {
    setStatus({
      status: "loading",
      message: "Performing clean install...",
    });
    await window.electronAPI.cleanInstall(gameInfo?.detectedLocation);
  };

  const handleUpdateMod = () => {
    setStatus({
      status: "loading",
      message: "Checking for mod update...",
    });
  };

  const handleInstallBetterCrew = async () => {
    setStatus({
      status: "loading",
      message: "Installing BetterCrewmates...",
    });
    await window.electronAPI.openExternal(import.meta.env.VITE_BETTER_CREW_URL);
  };

  const handleLaunchGame = async () => {
    setStatus({
      status: "idle",
      message: "Launching Among Us...",
    });
    await window.electronAPI.launchGame();
  };

  const handleRefresh = () => {
    setStatus({
      status: "loading",
      message: "Refreshing game information...",
    });
    setTimeout(() => {
      setStatus({
        status: "idle",
        message: "Idle. Game path detected successfully.",
      });
    }, 1500);
  };
  if (!gameInfo || !installedMods) {
    return (
      <div className={styles.logo}>
        <img src={logo} alt="Among Us Logo" className={styles.logoImageBig} />
        <h1 className={styles.logoText}>MOD MANAGER</h1>
        <div className={styles.logoText}>Loading...</div>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* Left Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.logo}>
            <img src={logo} alt="Among Us Logo" className={styles.logoImage} />
            <h1 className={styles.logoText}>MOD MANAGER</h1>
            <p>v{packageJson.version}</p>
          </div>

          <div className={styles.buttonGroup}>
            <Button
              label="LAUNCH AMONG US"
              icon={<TbBrandAmongUs />}
              onClick={handleLaunchGame}
              variant="primary"
              disabled={false}
            />
            <Button
              label="CLEAN INSTALL"
              icon={<GiBroom />}
              onClick={handleCleanInstall}
              variant="danger"
            />
            <Button
              label={
                installedMods["tou-mira"].isActive
                  ? "UPDATE MOD"
                  : "INSTALL MOD"
              }
              icon={<GrUpdate />}
              onClick={handleUpdateMod}
              variant="secondary"
              disabled={!gameInfo?.isInstalled}
            />
            {!installedMods["better-crewmates"].isActive && (
              <Button
                label="INSTALL BETTER CREW"
                icon={<FaMicrophone />}
                onClick={handleInstallBetterCrew}
                variant="purple"
                disabled={!gameInfo?.isInstalled}
              />
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className={styles.contentArea}>
          {gameInfo ? <GameInfo gameInfo={gameInfo} /> : <div>Loading...</div>}
          <InstalledMods mods={installedMods} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className={styles.footer}>
        <div className={styles.statusBar}>
          <span className={styles.statusText}>STATUS: {status.message}</span>
        </div>
        <button className={styles.refreshButton} onClick={handleRefresh}>
          REFRESH
        </button>
      </div>
    </div>
  );
};
