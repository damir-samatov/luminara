import { FC, ReactNode } from "react";
import { classNames } from "@/utils/style.utils";

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  type?: "primary" | "secondary" | "danger";
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
        "block w-full rounded border-2 px-4 py-2 text-center text-sm font-semibold text-gray-100",
        isDisabled && "cursor-not-allowed text-gray-500",
        type === "primary" &&
          "border-gray-700 bg-gray-700 hover:border-gray-600 hover:bg-gray-600",
        type === "secondary" &&
          "border-gray-700 bg-transparent hover:border-gray-600 hover:bg-gray-600",
        type === "danger" && "border-red-700 bg-transparent hover:bg-red-700",
        className
      )}
      disabled={isDisabled}
      onClick={() => !isDisabled && onClick()}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};
