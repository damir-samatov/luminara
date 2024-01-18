import { FC } from "react";

type SliderInputProps = {
  value: number;
  onChange: (value: number) => void;
  label: string;
  max: number;
  min: number;
  step: number;
  unit?: string;
};

export const SliderInput: FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
}) => {
  const safeValue = Math.max(min, Math.min(max, value));
  return (
    <div className="flex w-full flex-col gap-3 rounded-md bg-gray-900 p-4 text-sm text-gray-100">
      <p className="font-semibold">
        {label}: {value} {unit}
      </p>
      <div className="flex h-10 flex-col justify-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(+e.target.value)}
          value={safeValue}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700 accent-gray-100"
        />
      </div>
    </div>
  );
};
