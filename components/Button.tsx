import { FC, ReactNode } from "react";
import { classNames } from "@/utils/style.utils";

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  type?: "primary" | "secondary" | "danger" | "success";
  isDisabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
};

const CLASSNAME_MAP = {
  primary:
    "border-gray-700 bg-gray-700 hover:border-gray-600 hover:bg-gray-600",
  secondary:
    "border-gray-700 bg-transparent hover:border-gray-600 hover:bg-gray-600",
  danger: "border-red-700 bg-transparent hover:bg-red-700",
  success: "border-green-700 bg-transparent hover:bg-green-700",
};

export const Button: FC<ButtonProps> = ({
  onClick,
  children,
  isDisabled = false,
  type = "primary",
  loadingText = "Loading...",
  isLoading,
  className,
}) => {
  return (
    <button
      className={classNames(
        "block w-full rounded border-2 px-2 py-2 text-center text-xs font-semibold text-gray-100 md:px-4 md:text-sm",
        isDisabled && "cursor-not-allowed text-gray-500",
        CLASSNAME_MAP[type],
        className
      )}
      disabled={isDisabled}
      onClick={() => !isDisabled && onClick()}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};
