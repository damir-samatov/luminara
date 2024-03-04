import { FC } from "react";
import { classNames } from "@/utils/style.utils";

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  onEnter?: () => void;
};

export const TextInput: FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
  maxLength = 255,
  className = "",
  onEnter,
}) => {
  return (
    <input
      onKeyDown={(e) => {
        if (e.key === "Enter" && onEnter) {
          e.preventDefault();
          onEnter();
        }
      }}
      autoComplete="off"
      type="text"
      className={classNames(
        "block w-full rounded-md bg-gray-700 px-2 py-1 text-gray-300 placeholder-gray-400 outline-0",
        className
      )}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
