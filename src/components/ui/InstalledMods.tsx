import React from "react";
import { IModsInfo } from "../../types/mods";
import { ModItem } from "./ModItem";
import styles from "./InstalledMods.module.css";

interface InstalledModsProps {
  mods: IModsInfo;
}

export const InstalledMods: React.FC<InstalledModsProps> = ({ mods }) => {
  return (
    <div className={styles.installedModsContainer}>
      <h3 className={styles.title}>INSTALLED MODS</h3>
      <div className={styles.modsList}>
        {Object.entries(mods).map(([key, mod]) => (
          <ModItem key={key} mod={mod} />
        ))}
      </div>
    </div>
  );
};
