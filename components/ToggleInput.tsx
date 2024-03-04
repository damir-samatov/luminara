import { FC } from "react";
import { Switch } from "@headlessui/react";
import { classNames } from "@/utils/style.utils";

type ToggleInputProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

export const ToggleInput: FC<ToggleInputProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className="flex w-max items-center gap-2 rounded-md py-2 text-sm text-gray-200">
      <div className="w-max">
        <Switch
          checked={value}
          onChange={onChange}
          className={classNames(
            "relative inline-flex h-6 w-11 items-center rounded-full",
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
        className="cursor-pointer font-semibold"
        onClick={() => onChange(!value)}
      >
        {label}
      </button>
    </div>
  );
};
