import { FC } from "react";
import { Switch } from "@headlessui/react";
import { classNames } from "@/utils/style.utils";

type ToggleInputProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  isDisabled?: boolean;
};

export const ToggleInput: FC<ToggleInputProps> = ({
  label,
  value,
  onChange,
  isDisabled = false,
}) => {
  const onToggle = (value: boolean) => {
    if (isDisabled) return;
    onChange(value);
  };

  return (
    <div className="flex w-max items-center gap-2 rounded-md py-2 text-sm text-gray-200">
      <div className="w-max">
        <Switch
          checked={value}
          onChange={onToggle}
          className={classNames(
            "relative inline-flex h-6 w-11 items-center rounded-full",
            isDisabled ? "cursor-not-allowed opacity-75" : "cursor-pointer",
            value ? "bg-green-700" : "bg-gray-700"
          )}
        >
          <span
            className={classNames(
              "inline-block h-4 w-4 transform rounded-full bg-white transition",
              value ? "translate-x-6" : "translate-x-1"
            )}
          />
        </Switch>
      </div>
      <button
        className={classNames(
          "font-semibold",
          isDisabled ? "cursor-not-allowed opacity-75" : "cursor-pointer"
        )}
        onClick={() => onToggle(!value)}
      >
        {label}
      </button>
    </div>
  );
};
