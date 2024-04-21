import { FC } from "react";
import { Post, Video } from "@prisma/client";
import { onGetSignedFileReadUrl } from "@/actions/file.actions";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { ActionDataResponse } from "@/types/action.types";

type OnGetVideoUrlsResponse = ActionDataResponse<{
  videoUrl: string;
  thumbnailUrl: string;
}>;

const getVideoUrls = async (video: Video): Promise<OnGetVideoUrlsResponse> => {
  try {
    const [videoUrlRes, thumbnailUrlRes] = await Promise.all([
      onGetSignedFileReadUrl({ key: video.key }),
      onGetSignedFileReadUrl({ key: video.thumbnailKey }),
    ]);

    if (!videoUrlRes.success || !thumbnailUrlRes.success)
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        videoUrl: videoUrlRes.data.signedUrl,
        thumbnailUrl: thumbnailUrlRes.data.signedUrl,
      },
    };
  } catch (error) {
    console.error(error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type VideoPostItemProps = {
  post: Post & {
    videos: Video[];
  };
};

export const VideoPostItem: FC<VideoPostItemProps> = async ({ post }) => {
  const videoUrls = await Promise.all([...post.videos.map(getVideoUrls)]);
  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded bg-gray-800">
      {videoUrls.map(
        (res) =>
          res.success && (
            <div
              key={res.data.videoUrl}
              className="aspect-video w-full bg-black"
            >
              <video
                className="h-full w-full object-contain"
                controls
                width="480"
                height="360"
                src={res.data.videoUrl}
                poster={res.data.thumbnailUrl}
                preload="none"
              />
            </div>
          )
      )}
      <div className="flex flex-col gap-2 p-4">
        <p className="text-end text-xs text-gray-600">
          {post.createdAt.toDateString()}
        </p>
        <h2 className="text-3xl">{post.title}</h2>
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </div>
  );
};
