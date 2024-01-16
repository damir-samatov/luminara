"use client";
import { FC } from "react";
import { WifiIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils/tailwind.utils";

type VideoLoadingProps = {
  state: "loading" | "offline";
  text: string;
};

export const VideoPlaceholder: FC<VideoLoadingProps> = ({ state, text }) => {
  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-4  bg-gray-950 text-gray-300">
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
