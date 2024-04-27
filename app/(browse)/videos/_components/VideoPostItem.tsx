import { FC, ReactNode, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useOnClickOutside } from "usehooks-ts";

type VideoPostItemProps = {
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  link: string;
  date: Date;
  actions?: ReactNode;
};

export const VideoPostItem: FC<VideoPostItemProps> = ({
  link,
  title,
  videoUrl,
  thumbnailUrl,
  date,
  actions,
}) => {
  const [showActions, setShowActions] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const onMouseEnter = useCallback(() => {
    videoRef.current?.play();
  }, []);

  const onMouseLeave = useCallback(() => {
    videoRef.current?.pause();
    videoRef.current?.load();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    setShowActions(false);
  }, []);
  useOnClickOutside(containerRef, handleClickOutside);

  return (
    <div className="mx-auto w-full max-w-4xl rounded">
      <Link href={link}>
        <video
          ref={videoRef}
          className="aspect-video w-full rounded-md bg-black object-contain"
          src={videoUrl}
          poster={thumbnailUrl}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          muted={true}
          preload="none"
          loop
        />
      </Link>
      <div className="relative mt-6 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2 overflow-x-hidden">
          <h2 className="truncate text-xl">{title}</h2>
          <p className="text-xs text-gray-500">{date.toDateString()}</p>
        </div>
        {actions && (
          <button
            disabled={showActions}
            onClick={() => setShowActions(true)}
            className="py-1 pl-4 text-gray-400 hover:text-gray-100"
          >
            <EllipsisVerticalIcon className="h-6 w-6" />
          </button>
        )}
        {actions && showActions && (
          <div ref={containerRef} className="absolute right-4 top-10">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
