import type { FC } from "react";

const IconButtonModal = {
  primary:
    "bg-blue-50 hover:bg-blue-600 px-4 flex items-center gap-2 py-2 cursor-pointer rounded text-blue-600 hover:text-white font-medium",
  secondary:
    "bg-indigo-50 hover:bg-indigo-600 px-4 flex items-center gap-2 py-2 cursor-pointer rounded text-indigo-600 hover:text-white font-medium",
  danger:
    "bg-red-50 hover:bg-red-600 px-4 flex items-center gap-2 py-2 cursor-pointer rounded text-red-600 hover:text-white font-medium",
  warning:
    "bg-yellow-50 hover:bg-yellow-600 px-4 flex items-center gap-2 py-2 cursor-pointer rounded text-yellow-600 hover:text-white font-medium",
  success:
    "bg-green-50 hover:bg-green-600 px-4 flex items-center gap-2 py-2 cursor-pointer rounded text-green-600 hover:text-white font-medium",
  dark: "bg-zinc-50 hover:bg-zinc-600 px-4 flex items-center gap-2 py-2 cursor-pointer rounded text-zinc-600 hover:text-white font-medium",
  info: "bg-cyan-50 hover:bg-cyan-600 px-4 flex items-center gap-2 py-2 cursor-pointer rounded text-cyan-600 hover:text-white font-medium",
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
}

const IconButton: FC<IconButtonInterface> = ({
  children,
  type = "primary",
  onClick,
  icon,
}) => {
  return (
    <button className={IconButtonModal[type]} onClick={onClick}>
      {icon && <i className={`ri-${icon}`}></i>}
      {children && children}
    </button>
  );
};

export default IconButton;
