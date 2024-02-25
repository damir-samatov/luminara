import { FC } from "react";

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  disableWrapper?: boolean;
};

export const TextInput: FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength = 255,
  disableWrapper = false,
}) => {
  const input = (
    <input
      autoComplete="off"
      type="text"
      className="block h-8 w-full rounded-md bg-gray-700 px-4 text-gray-100 placeholder-gray-400 outline-0"
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  );

  if (disableWrapper) return input;

  return (
    <div className="flex w-full flex-col gap-3 rounded-md bg-gray-900 p-4 text-sm text-gray-100">
      {label && <p className="font-semibold">{label}</p>}
      {input}
    </div>
  );
};
