import type { FC, ReactElement } from "react";

interface ModalInterface {
  title?: string;
  onClose?: () => void;
  children?: ReactElement;
  open: boolean;
}

const Modal: FC<ModalInterface> = ({ open, title, onClose, children }) => {
  return (
    <>
      {open && (
        <div className="w-full h-screen bg-black/50 flex items-center justify-center fixed top-0 left-0 transition-all duration-300 animate__animated animate__fadeIn ">
          <div className="bg-white p-4 rounded shadow-lg animate__animated animate__fadeIn">
            <div className="w-full flex justify-between items-center">
              <h1 className="">{title}</h1>
              <i
                className="ri-close-circle-fill cursor-pointer"
                onClick={onClose}
              ></i>
            </div>
            <p className="text-gray-500 mt-5">{children}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
