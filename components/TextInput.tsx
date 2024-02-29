import { FC } from "react";
import { classNames } from "@/utils/style.utils";

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
};

export const TextInput: FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
  maxLength = 255,
  className = "",
}) => {
  return (
    <input
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
