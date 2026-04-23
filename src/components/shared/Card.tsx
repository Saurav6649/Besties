import type { FC, ReactElement, ReactNode } from "react";

interface CardInterface {
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactElement;
  divider?: boolean;
  border?: boolean;
  shadow?: boolean;
  width?: boolean;
}

const Card: FC<CardInterface> = ({
  title,
  children,
  footer,
  divider = false,
  border = false,
  shadow = false,
  width = false,
}) => {
  return (
    <div
      className={[
        "p-2 rounded-lg space-y-2 bg-white overflow-visible ",
        shadow && "shadow-lg",
        width && "w-full",
        border && "border border-gray-100",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title && <h1 className="font-medium">{title}</h1>}

      {divider && <div className="border border-gray-100 -mx-3"></div>}

      {children && <div className="text-gray-500">{children}</div>}

      {footer && <h2 className="text-xs mt-3">{footer}</h2>}
    </div>
  );
};

export default Card;
