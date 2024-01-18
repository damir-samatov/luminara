import { FC, ReactNode } from "react";
import { classNames } from "@/utils/tailwind.utils";

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  type?: "primary" | "secondary" | "danger";
  size?: "max-content" | "full";
  isDisabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
};

export const Button: FC<ButtonProps> = ({
  onClick,
  children,
  size = "full",
  isDisabled = false,
  type = "primary",
  loadingText = "LOADING...",
  isLoading,
}) => {
  return (
    <button
      className={classNames(
        "w-min-10 block rounded-md border-2 border-gray-800 px-8 py-2 text-sm font-semibold hover:border-gray-700 hover:bg-gray-700",
        size === "max-content" ? "w-max" : "w-full",
        type === "primary" ? "bg-gray-800" : "bg-transparent"
      )}
      disabled={isDisabled}
      onClick={onClick}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};
