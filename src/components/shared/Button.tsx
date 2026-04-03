import type { FC } from "react";

const ButtonModal = {
  primary:
    "bg-blue-500 hover:bg-blue-600 px-5 py-2 cursor-pointer rounded text-white font-medium",
  secondary:
    "bg-indigo-500 hover:bg-indigo-600 px-5 py-2 cursor-pointer rounded text-white font-medium",
  danger:
    "bg-red-500 hover:bg-red-600 px-5 py-2 cursor-pointer rounded text-white font-medium",
  warning:
    "bg-yellow-500 hover:bg-yellow-600 px-5 py-2 cursor-pointer rounded text-white font-medium",
  success:
    "bg-green-500 hover:bg-green-600 px-5 py-2 cursor-pointer rounded text-white font-medium",
  dark: "bg-zinc-500 hover:bg-zinc-600 px-5 py-2 cursor-pointer rounded text-white font-medium",
  info: "bg-cyan-500 hover:bg-cyan-600 px-5 py-2 cursor-pointer rounded text-white font-medium",
};

interface ButtonInterface {
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
  key?: string | number;
  loading?: boolean;
  size?:string
}

const Button: FC<ButtonInterface> = ({
  children = "submit",
  icon,
  onClick,
  type = "primary",
  key = 0,
  loading,
  size = "lg"
}) => {
  if (loading) return <button className="text-gray-500" disabled> <i className="fa fa-spinner fa-spin"></i>  Loading</button>;

  return (
    <button key={key} className={ButtonModal[type] || `${size === "lg" ? "px-4 py-3 " : "px-3 py-2"} rounded-full`} onClick={onClick}>
      {icon && <i className={`ri-${icon} mr-2`}></i>}
      {children}
    </button>
  );
};

export default Button;
