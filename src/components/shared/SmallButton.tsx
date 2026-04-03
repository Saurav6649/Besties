import type { FC } from "react";

const SmallButtonModal = {
  primary:
    "bg-blue-500 hover:bg-blue-600 px-4 py-1.5 text-[12px] cursor-pointer rounded text-white font-medium",
  secondary:
    "bg-indigo-500 hover:bg-indigo-600 px-4 py-1.5 text-[12px] cursor-pointer rounded text-white font-medium",
  danger:
    "bg-red-500 hover:bg-red-600 px-4 py-1.5 text-[12px] cursor-pointer rounded text-white font-medium",
  warning:
    "bg-yellow-500 hover:bg-yellow-600 px-4 py-1.5 text-[12px] cursor-pointer rounded text-white font-medium",
  success:
    "bg-green-500 hover:bg-green-600 px-4 py-1.5 text-[12px] cursor-pointer rounded text-white font-medium",
  dark: "bg-zinc-500 hover:bg-zinc-600 px-4 py-1.5 text-[12px] cursor-pointer rounded text-white font-medium",
  info: "bg-cyan-500 hover:bg-cyan-600 px-4 py-1.5 text-[12px] cursor-pointer rounded text-white font-medium",
};

interface SmallButtonInterface {
  children?: string;
  icon?: string;
  onClick?: () => void;
  type?:
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "success"
    | "dark"
    | "info";
  loading?: boolean;
}

const SmallButton: FC<SmallButtonInterface> = ({
  children = "submit",
  icon,
  onClick,
  type = "primary",
  loading,
}) => {
  if (loading)
    return (
      <button className="text-gray-500 text-[12px] px-4 py-1.5" disabled>
        <i className="fa fa-spinner fa-spin mr-2"></i> Loading
      </button>
    );

  return (
    <button className={SmallButtonModal[type]} onClick={onClick}>
      {icon && <i className={`ri-${icon} mr-1`}></i>}
      {children}
    </button>
  );
};

export default SmallButton;
