"use client";
import { FC, RefObject } from "react";

type VideoPlayerProps = {
  videoRef: RefObject<HTMLVideoElement>;
};

export const VideoPlayer: FC<VideoPlayerProps> = ({ videoRef }) => {
  return (
    <div className="aspect-video w-full">
      <video
        ref={videoRef}
        controls
        muted
        autoPlay
        loop
        className="w-full object-contain object-center"
      />
    </div>
  );
};