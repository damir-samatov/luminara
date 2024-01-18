import { FC } from "react";

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
};

export const TextInput: FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <p>{label}</p>}
      <input
        autoComplete="off"
        type="text"
        className="block w-full rounded-md bg-gray-800 p-4 text-gray-100 placeholder-gray-500 outline-0"
        value={value}
        placeholder={placeholder}
        maxLength={255}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};
