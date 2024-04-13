import { FC, ReactNode } from "react";
import { classNames } from "@/utils/style.utils";

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  type?: "primary" | "secondary" | "danger";
  size?: "max-content" | "full";
  isDisabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
};

export const Button: FC<ButtonProps> = ({
  onClick,
  children,
  size = "full",
  isDisabled = false,
  type = "primary",
  loadingText = "Loading...",
  isLoading,
  className,
}) => {
  return (
    <button
      className={classNames(
        "w-min-10 block rounded-md border-2 border-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-300",
        size === "max-content" ? "w-max" : "w-full",
        type === "primary" ? "bg-gray-800" : "bg-transparent",
        isDisabled
          ? "cursor-not-allowed text-gray-500"
          : "cursor-pointer text-gray-300 hover:border-gray-700 hover:bg-gray-700",
        className
      )}
      disabled={isDisabled}
      onClick={() => !isDisabled && onClick()}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};
