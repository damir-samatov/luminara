import { FC } from "react";
import { VideoPostDto } from "@/types/post.types";

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
        <p className="ml-auto text-xs text-gray-500">
          Subscription plan:
          {videoPost.subscriptionPlan
            ? ` ${videoPost.subscriptionPlan.title} - ${videoPost.subscriptionPlan.price}$`
            : " Follower - Free"}
        </p>
      </div>
    </div>
  );
};
