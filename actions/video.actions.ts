"use server";
import { ActionDataResponse } from "@/types/action.types";
import { Post, Video } from "@prisma/client";
import { authSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import {
  createVideoPost,
  getVideoPostsByUserId,
} from "@/services/post.service";
import { VideoPostCreateDto } from "@/types/post.types";
import { generateFileKey } from "@/helpers/server/s3.helpers";
import { getSignedFileUploadUrl } from "@/services/s3.service";
import {
  ELIGIBLE_IMAGE_TYPES,
  ELIGIBLE_VIDEO_TYPES,
  VIDEO_MAX_SIZE,
  VIDEO_THUMBNAIL_IMAGE_MAX_SIZE,
} from "@/configs/file.config";
import { revalidatePath } from "next/cache";

type OnGetSelfVideoPostsResponse = ActionDataResponse<{
  posts: (Post & {
    videos: Video[];
  })[];
}>;

export const onGetSelfVideoPosts =
  async (): Promise<OnGetSelfVideoPostsResponse> => {
    try {
      const self = await authSelf();
      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
      const posts = await getVideoPostsByUserId(self.id);
      return {
        success: true,
        data: {
          posts,
        },
      };
    } catch (error) {
      console.error("onGetSelfPosts", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };

type OnCreateVideoPostResponse = ActionDataResponse<{
  videoUploadUrl: string;
  thumbnailUploadUrl: string;
}>;

export const onCreateVideoPost = async ({
  title,
  body,
  video,
  thumbnail,
}: VideoPostCreateDto): Promise<OnCreateVideoPostResponse> => {
  try {
    if (
      video.size > VIDEO_MAX_SIZE ||
      !ELIGIBLE_VIDEO_TYPES.includes(video.type) ||
      thumbnail.size > VIDEO_THUMBNAIL_IMAGE_MAX_SIZE ||
      !ELIGIBLE_IMAGE_TYPES.includes(thumbnail.type) ||
      title.length < 1
    )
      return ERROR_RESPONSES.BAD_REQUEST;

    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const thumbnailKey = generateFileKey("images");
    const videoKey = generateFileKey("videos");

    const [thumbnailUploadUrl, videoUploadUrl] = await Promise.all([
      getSignedFileUploadUrl({
        key: thumbnailKey,
        type: thumbnail.type,
        size: thumbnail.size,
      }),
      getSignedFileUploadUrl({
        key: videoKey,
        type: video.type,
        size: video.size,
      }),
    ]);

    if (!thumbnailUploadUrl || !videoUploadUrl)
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const post = await createVideoPost({
      userId: self.id,
      title,
      body,
      video: {
        title,
        key: videoKey,
        thumbnailKey,
      },
    });

    if (!post) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/videos");

    return {
      success: true,
      data: {
        videoUploadUrl,
        thumbnailUploadUrl,
      },
    };
  } catch (error) {
    console.error("onCreateVideoPost", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
