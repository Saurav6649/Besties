import { type FC } from "react";

interface ErrorInterface {
  message: string;
}

const Error: FC<ErrorInterface> = ({ message }) => {
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
      
      {/* Icon */}
      <i className="ri-error-warning-line text-xl"></i>

      {/* Message */}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Error;