import { FC } from "react";

type SliderInputProps = {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min: number;
  step: number;
};

export const SliderInput: FC<SliderInputProps> = ({
  value,
  onChange,
  min,
  max,
  step,
}) => {
  const safeValue = Math.max(min, Math.min(max, value));
  return (
    <div className="flex h-4 flex-col justify-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(+e.target.value)}
        value={safeValue}
        className="h-2 cursor-pointer appearance-none rounded-lg bg-gray-700 accent-gray-300"
      />
    </div>
  );
};
