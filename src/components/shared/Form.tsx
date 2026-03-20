import React, { type FC, type FormEvent, type ReactNode } from "react";

type DataType = Record<string, string>;

interface FormInterface {
  className: string;
  children: ReactNode;
  onValue: (value: DataType) => void;
}

const Form: FC<FormInterface> = ({ className, children, onValue }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formdata = new FormData(form);
  const data: DataType = {};

  formdata.forEach((value, key) => {
    data[key] = value.toString();
  });

  onValue(data);
};
  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

export default Form;
