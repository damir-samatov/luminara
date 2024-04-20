import { FC, KeyboardEventHandler, useCallback } from "react";
import { classNames } from "@/utils/style.utils";

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  onEnter?: () => void;
  isDisabled?: boolean;
};

export const TextInput: FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
  maxLength = 255,
  className = "",
  onEnter,
  isDisabled = false,
}) => {
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.key === "Enter" && onEnter) {
        e.preventDefault();
        onEnter();
      }
    },
    [onEnter]
  );

  return (
    <input
      onKeyDown={onKeyDown}
      autoComplete="off"
      type="text"
      className={classNames(
        "block h-auto w-full rounded border-2 border-gray-700 bg-transparent px-2 py-1 text-gray-300 placeholder-gray-400 outline-0",
        isDisabled ? "cursor-not-allowed" : "",
        className
      )}
      disabled={isDisabled}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
