import React, { type FC, type FormEvent, type ReactNode } from "react";

export type FormDataType = Record<string, string>;

interface FormInterface {
  className?: string;
  children: ReactNode;
  form: boolean;
  onValue?: (value: FormDataType) => void;
}

const Form: FC<FormInterface> = ({ className, children, onValue, form }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const forms = e.currentTarget;
    const formdata = new FormData(forms);
    const data: FormDataType = {};

    formdata.forEach((value, key) => {
      data[key] = value.toString();
    });

    if (onValue) {
      onValue(data);
    }

    if (form) forms.reset();
  };
  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

export default Form;
