"use server";
import { ActionDataResponse } from "@/types/action.types";
import { Post, Video } from ".prisma/client";
import { getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import {
  createVideoPost,
  getVideoPostsByUserId,
} from "@/services/post.service";
import { VideoPostCreateDto } from "@/types/post.types";

type OnGetSelfVideoPostsResponse = ActionDataResponse<{
  posts: (Post & {
    videos: Video[];
  })[];
}>;

export const onGetSelfVideoPosts =
  async (): Promise<OnGetSelfVideoPostsResponse> => {
    try {
      const self = await getSelf();
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
  post: Post;
}>;

export const onCreateVideoPost = async (
  videoPostCreateDto: Omit<VideoPostCreateDto, "userId">
): Promise<OnCreateVideoPostResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const post = await createVideoPost({
      ...videoPostCreateDto,
      userId: self.id,
    });
    if (!post) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    return {
      success: true,
      data: {
        post,
      },
    };
  } catch (error) {
    console.error("onCreatePost", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
