import type { FC, ReactNode } from "react";

interface AvatarInterface {
  title?: string | null;
  subtitle?: ReactNode
  img?: string;
  titleColor?: string;
  subtitleColor?: string;
  size?: "lg" | "md";
}

const Avatar: FC<AvatarInterface> = ({
  title,
  subtitle = "subtitle missing",
  img,
  titleColor = "#ffffff",
  subtitleColor = "#f5f5f5",
  size='lg',
}) => {
  return (
    <div className="flex items-center justify-center  gap-3">
      {img && (
        <img
          className={`${size === "lg" ? "h-12 w-12" : "h-8 w-8"} rounded-full`}
          src={img}
          alt=""
        />
      )}
      {title && subtitle && (
        <div>
          <h1
            className={`font-medium ${size === 'lg'?'text-[15px]/6':'text-[12px]/4'}`}
            style={{ color: titleColor }}
          >
            {title}
          </h1>
          <div
            className={`text-gray-300 ${size === 'lg'?'text-xs':'text-[10px]'}`}
            style={{ color: subtitleColor }}
          >
            {subtitle}
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
