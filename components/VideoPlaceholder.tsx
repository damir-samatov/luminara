"use client";
import { FC } from "react";
import { WifiIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils/style.utils";

type VideoPlaceholderProps = {
  state: "loading" | "offline";
  text: string;
};

export const VideoPlaceholder: FC<VideoPlaceholderProps> = ({
  state,
  text,
}) => {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 text-gray-300">
      <WifiIcon
        className={classNames(
          state === "loading" && "animate-pulse",
          "h-14",
          "w-14"
        )}
      />
      <p>{text}</p>
    </div>
  );
};
