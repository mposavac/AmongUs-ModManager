import React from "react";
import { ModItem as ModItemType } from "../../types/mods";
import styles from "./ModItem.module.css";

interface ModItemProps {
  mod: ModItemType;
}

export const ModItem: React.FC<ModItemProps> = ({ mod }) => {
  return (
    <div className={styles.modItem}>
      <div className={styles.modContent}>
        <img src={mod.icon} alt={mod.name} className={styles.modIcon} />
        <div className={styles.modInfo}>
          <div className={styles.modName}>{mod.name}</div>
          <div className={styles.modVersion}>{mod.version}</div>
        </div>
      </div>
      {mod.isActive && <span className={styles.activeBadge}>(Active)</span>}
    </div>
  );
};
