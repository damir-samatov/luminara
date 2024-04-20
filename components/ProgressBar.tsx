import { FC } from "react";

type ProgressBarProps = {
  progress: number;
};
export const ProgressBar: FC<ProgressBarProps> = ({ progress }) => {
  progress = Math.max(0, Math.min(1, progress));
  const progressPercentage = (progress * 100).toFixed();
  return (
    <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-gray-700">
      <div
        className="h-3.5 w-full origin-left rounded-full bg-green-600 transition-transform"
        style={{ transform: `scale(${progressPercentage}%, 100%)` }}
      />
      <p className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center text-xs leading-none">
        {progressPercentage}%
      </p>
    </div>
  );
};
