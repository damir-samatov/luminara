"use client";
import { FC, RefObject } from "react";

type VideoPlayerProps = {
  videoRef: RefObject<HTMLVideoElement>;
};

export const VideoPlayer: FC<VideoPlayerProps> = ({ videoRef }) => {
  return (
    <div className="aspect-video w-full bg-gray-950">
      <video
        width="100%"
        ref={videoRef}
        controls
        muted
        autoPlay
        loop
        className="w-full bg-gray-950 object-contain object-center"
      />
    </div>
  );
};
