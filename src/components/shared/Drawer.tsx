import type { FC } from "react";

interface DrawerInterface {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  children?: string;
}

const Drawer: FC<DrawerInterface> = ({
  open = true,
  title = "Drawer Title",
  onClose,
  children = "Content goes here",
}) => {
  return (
    <div
      style={{ right: open ? 0 : "-50%" }}
      className="shadow-lg w-6/12 rounded h-full p-4 space-y-4 fixed top-0 right-0  duration-300 transition-all"
    >
      <div className="w-full flex justify-between items-center">
        <h1 className="">{title}</h1>
        <i
          className="ri-close-circle-fill cursor-pointer"
          onClick={onClose}
        ></i>
      </div>
      <div className="border border-gray-100 -mx-3 my-3"></div>
      <p className="text-gray-500 mt-5">{children}</p>
    </div>
  );
};

export default Drawer;
