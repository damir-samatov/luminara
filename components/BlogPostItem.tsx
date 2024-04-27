import { FC, ReactNode, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useOnClickOutside } from "usehooks-ts";

type BlogPostItemProps = {
  title: string;
  imageUrl: string;
  link: string;
  date: Date;
  actions?: ReactNode;
};

export const BlogPostItem: FC<BlogPostItemProps> = ({
  title,
  imageUrl,
  link,
  date,
  actions,
}) => {
  const [showActions, setShowActions] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    setShowActions(false);
  }, []);
  useOnClickOutside(containerRef, handleClickOutside);

  return (
    <div className="mx-auto w-full max-w-4xl rounded">
      <Link className="block" href={link}>
        <img
          className="aspect-video w-full rounded-md bg-black object-contain"
          width={1920}
          height={1080}
          src={imageUrl}
          alt={title}
          loading="eager"
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
            className="rounded-lg px-2 py-2 text-gray-400 hover:bg-gray-800 hover:text-gray-100"
          >
            <EllipsisVerticalIcon className="h-6 w-6" />
          </button>
        )}
        {actions && showActions && (
          <div ref={containerRef} className="absolute right-4 top-10 z-20">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
