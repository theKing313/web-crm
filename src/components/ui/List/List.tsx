import React from "react";
import { cn } from "../../../lib/utils";
import styles from "./index.module.scss";

interface ListProps {
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  // if you want other div props, you can do this instead:
  divProps?: React.HTMLAttributes<HTMLDivElement>;
}

const List: React.FC<ListProps> = ({
  className,
  children,
  onClick,
  ...props
}) => {
  return (
    <div className={cn(styles.listItem, className)} {...props}>
      <button className={styles.button} onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

List.displayName = "List";

export { List };
