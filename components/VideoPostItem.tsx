import { FC } from "react";
import { VideoPostDto } from "@/types/post.types";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";
import { VideoPostDeleterModal } from "@/app/(browse)/videos/_components/VideoPostDeleteModal";

type VideoPostItemProps = {
  videoPost: VideoPostDto;
};

export const VideoPostItem: FC<VideoPostItemProps> = async ({ videoPost }) => {
  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded bg-gray-800">
      {videoPost.videoUrl && (
        <div key={videoPost.videoUrl} className="aspect-video w-full bg-black">
          <video
            className="h-full w-full object-contain"
            controls
            width="480"
            height="360"
            src={videoPost.videoUrl}
            poster={videoPost.thumbnailUrl}
            preload="none"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 p-4">
        <p className="text-end text-xs text-gray-500">
          Published at: {videoPost.createdAt.toDateString()}
        </p>
        <h2 className="text-3xl">{videoPost.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: videoPost.body }} />
        <p>
          {videoPost.subscriptionPlan
            ? ` ${videoPost.subscriptionPlan.title} - ${videoPost.subscriptionPlan.price}$`
            : " Follower - Free"}
        </p>
        <div className="ml-auto mt-auto grid grid-cols-2 gap-2">
          <Link
            href={`/videos/${videoPost.id}`}
            className="ml-auto flex w-full items-center justify-center gap-2 rounded border-2 border-gray-700 bg-transparent px-2 py-2 text-center text-xs font-semibold text-gray-100 hover:border-gray-600 hover:bg-gray-600 md:px-4 md:text-sm"
          >
            <PencilIcon className="h-3 w-3" />
            <span>Edit</span>
          </Link>
          <VideoPostDeleterModal id={videoPost.id} />
        </div>
      </div>
    </div>
  );
};
