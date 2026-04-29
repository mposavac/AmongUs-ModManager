import React, { ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "purple";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  onClick,
  variant = "secondary",
  disabled,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      title={label}
      disabled={disabled}
    >
      {icon}
      <span className={styles.label}>{label}</span>
    </button>
  );
};
