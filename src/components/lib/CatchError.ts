import axios from "axios";
import { toast, type ToastPosition } from "react-toastify";

export const Catcherr = (
  err: unknown,
  position: ToastPosition = "top-center",
) => {
  if (axios.isAxiosError(err)) {
    return toast.error(err.response?.data.message, { position });
  }

  if (err instanceof Error) {
    return toast.error(err.message, { position });
  }

  return toast.error("Network error", { position });
};
