import type { FC } from "react";

// ✅ CHANGED: removed padding & text-size (handled by sizeClasses)
const IconButtonModal = {
  primary:
    "bg-blue-50 hover:bg-blue-600 flex items-center gap-1 cursor-pointer rounded text-blue-600 hover:text-white font-medium min-w-0",
  secondary:
    "bg-indigo-50 hover:bg-indigo-600 flex items-center gap-1 cursor-pointer rounded text-indigo-600 hover:text-white font-medium min-w-0",
  danger:
    "bg-red-50 hover:bg-red-600 flex items-center gap-1 cursor-pointer rounded text-red-600 hover:text-white font-medium min-w-0",
  warning:
    "bg-yellow-50 hover:bg-yellow-600 flex items-center gap-1 cursor-pointer rounded text-yellow-600 hover:text-white font-medium min-w-0",
  success:
    "bg-green-50 hover:bg-green-600 flex items-center gap-1 cursor-pointer rounded text-green-600 hover:text-white font-medium min-w-0",
  dark:
    "bg-zinc-50 hover:bg-zinc-600 flex items-center gap-1 cursor-pointer rounded text-zinc-600 hover:text-white font-medium min-w-0",
  info:
    "bg-cyan-50 hover:bg-cyan-600 flex items-center gap-1 cursor-pointer rounded text-cyan-600 hover:text-white font-medium min-w-0",
};

// ✅ NEW: size classes
const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

interface IconButtonInterface {
  children?: string;
  type?:
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "success"
    | "dark"
    | "info";
  icon?: string;
  onClick?: () => void;

  // ✅ NEW
  size?: "sm" | "md" | "lg";
}

const IconButton: FC<IconButtonInterface> = ({
  children,
  type = "primary",
  onClick,
  icon,
  size = "sm", // ✅ DEFAULT SMALL
}) => {
  return (
    <button
      className={`${IconButtonModal[type]} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {icon && <i className={`ri-${icon}`}></i>}

      {/* ✅ text overflow fix */}
      {children && <span className="truncate">{children}</span>}
    </button>
  );
};

export default IconButton;