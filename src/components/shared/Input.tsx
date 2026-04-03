import type { FC } from "react";

interface InputInterface {
  type?: "text" | "password" | "file" | "number"
  name: string;
  placeholder?: string;
}

const Input: FC<InputInterface> = ({ type , placeholder ="Enter your placeholder", name }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      className="border w-full border-gray-200 px-4 outline-none py-2 rounded-lg"
    />
  );
};
export default Input;
