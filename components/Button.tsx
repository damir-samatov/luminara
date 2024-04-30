import { FC, ReactNode } from "react";
import { classNames } from "@/utils/style.utils";

const CLASSNAME_MAP = {
  primary:
    "border-gray-700 bg-gray-700 enabled:hover:border-gray-600 enabled:hover:bg-gray-600",
  secondary:
    "border-gray-700 bg-transparent enabled:hover:border-gray-600 enabled:hover:bg-gray-600",
  danger: "border-red-700 bg-transparent enabled:hover:bg-red-700",
  success: "border-green-700 bg-transparent enabled:hover:bg-green-700",
  transparent: "border-transparent bg-transparent enabled:hover:bg-gray-700",
  blank: "",
};

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  type?: keyof typeof CLASSNAME_MAP;
  isDisabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
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
        type !== "blank" &&
          "block w-full rounded border-2 px-4 py-2 text-center text-xs font-semibold text-gray-100 md:text-sm",
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
