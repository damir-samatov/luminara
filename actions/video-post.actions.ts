"use server";
import { ActionDataResponse } from "@/types/action.types";
import { authSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import {
  createVideoPost,
  getVideoPostById,
  getVideoPostsByUserId,
} from "@/services/post.service";
import { VideoPostCreateDto, VideoPostDto } from "@/types/post.types";
import { generateFileKey } from "@/helpers/server/s3.helpers";
import {
  getSignedFileReadUrl,
  getSignedFileUploadUrl,
} from "@/services/s3.service";
import {
  ELIGIBLE_IMAGE_TYPES,
  ELIGIBLE_VIDEO_TYPES,
  VIDEO_MAX_SIZE,
  VIDEO_THUMBNAIL_IMAGE_MAX_SIZE,
} from "@/configs/file.config";
import { getSubscriptionPlanById } from "@/services/subscription-plan.service";
import { revalidatePath } from "next/cache";

type OnGetSelfVideoPostsResponse = ActionDataResponse<{
  videoPosts: VideoPostDto[];
}>;

export const onGetSelfVideoPosts =
  async (): Promise<OnGetSelfVideoPostsResponse> => {
    try {
      const self = await authSelf();
      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
      const posts = await getVideoPostsByUserId(self.id);
      const videoPosts = await Promise.all(
        posts.map(async (post) => {
          const video = post.videos[0];
          const [videoUrl, thumbnailUrl] = await Promise.all([
            getSignedFileReadUrl(video?.key || ""),
            getSignedFileReadUrl(video?.thumbnailKey || ""),
          ]);
          return {
            id: post.id,
            title: post.title,
            body: post.body,
            videoUrl: videoUrl,
            thumbnailUrl: thumbnailUrl,
            subscriptionPlan: post.subscriptionPlan,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
          };
        })
      );
      return {
        success: true,
        data: {
          videoPosts,
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
  subscriptionPlanId,
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

    if (subscriptionPlanId !== null) {
      const subscriptionPlan =
        await getSubscriptionPlanById(subscriptionPlanId);
      if (!subscriptionPlan) return ERROR_RESPONSES.NOT_FOUND;
      if (subscriptionPlan.userId !== self.id)
        return ERROR_RESPONSES.UNAUTHORIZED;
    }

    const thumbnailKey = generateFileKey(self.id);
    const videoKey = generateFileKey(self.id);

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
      subscriptionPlanId,
      video: {
        title,
        key: videoKey,
        thumbnailKey,
      },
    });

    if (!post) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/videos", "page");

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

type OnGetVideoPostByIdResponse = ActionDataResponse<{
  videoPost: VideoPostDto;
}>;

export const onGetVideoPostById = async (
  id: string
): Promise<OnGetVideoPostByIdResponse> => {
  try {
    const [self, videoPost] = await Promise.all([
      authSelf(),
      getVideoPostById(id),
    ]);

    if (!videoPost) return ERROR_RESPONSES.NOT_FOUND;
    if (!self || videoPost.userId !== self.id)
      return ERROR_RESPONSES.UNAUTHORIZED;

    const video = videoPost.videos[0];
    if (!video) return ERROR_RESPONSES.NOT_FOUND;

    const [videoUrl, thumbnailUrl] = await Promise.all([
      getSignedFileReadUrl(video.key),
      getSignedFileReadUrl(video.thumbnailKey),
    ]);

    return {
      success: true,
      data: {
        videoPost: {
          id: videoPost.id,
          title: videoPost.title,
          body: videoPost.body,
          videoUrl,
          thumbnailUrl,
          subscriptionPlan: videoPost.subscriptionPlan,
          createdAt: videoPost.createdAt,
          updatedAt: videoPost.updatedAt,
        },
      },
    };
  } catch (error) {
    console.error("onGetVideoPostById", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetVideoPostVideoThumbnailUploadUrl = (props: {
  postId: string;
  type: string;
  size: number;
}) => Promise<ActionDataResponse<{ uploadUrl: string }>>;

export const onGetVideoPostThumbnailUploadUrl: OnGetVideoPostVideoThumbnailUploadUrl =
  async ({ postId, type, size }) => {
    try {
      const [self, post] = await Promise.all([
        authSelf(),
        getVideoPostById(postId),
      ]);

      if (!post) return ERROR_RESPONSES.NOT_FOUND;
      if (!self || post.userId !== self.id) return ERROR_RESPONSES.UNAUTHORIZED;
      const video = post.videos[0];
      if (!video) return ERROR_RESPONSES.NOT_FOUND;

      const uploadUrl = await getSignedFileUploadUrl({
        key: video.thumbnailKey,
        type,
        size,
      });

      if (!uploadUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

      revalidatePath("/videos", "page");
      revalidatePath(`/videos/${postId}`, "page");

      return {
        success: true,
        data: {
          uploadUrl,
        },
      };
    } catch (error) {
      console.error("onGetVideoPostThumbnailUploadUrl", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };
