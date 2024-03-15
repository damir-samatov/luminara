"use client";
import { FC } from "react";
import { WifiIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type VideoPlaceholderProps = {
  text: string;
  placeholderUrl: string;
};

export const VideoPlaceholder: FC<VideoPlaceholderProps> = ({
  text,
  placeholderUrl,
}) => {
  return (
    <div className="relative aspect-video w-full rounded">
      <div className="absolute bottom-0 left-0 right-0 top-0">
        <Image
          className="absolute rounded"
          src={placeholderUrl}
          alt={text}
          loading="eager"
          width={1920}
          height={1080}
        />
      </div>
      <div className="absolute left-1/2 top-1/2 z-10 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-xl bg-gray-900 p-6 text-sm text-gray-200">
        <WifiIcon className="h-10 w-10 animate-pulse" />
        <p>{text}</p>
      </div>
    </div>
  );
};
