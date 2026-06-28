import React from "react";
import { IGameInfo as GameInfoType } from "../../types/mods";
import styles from "./GameInfo.module.css";

interface GameInfoProps {
  gameInfo: GameInfoType;
}

export const GameInfo: React.FC<GameInfoProps> = ({ gameInfo }) => {
  return (
    <div className={styles.gameInfoContainer}>
      <h2 className={styles.title}>GAME INFORMATION</h2>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Among Us Installed:</span>
          <span
            className={gameInfo.isInstalled ? styles.success : styles.error}
          >
            {gameInfo.isInstalled ? "YES" : "NO"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Location:</span>
          <span className={styles.value}>{gameInfo.detectedLocation}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Version:</span>
          <span className={styles.value}>{gameInfo.version}</span>
        </div>
      </div>
    </div>
  );
};
