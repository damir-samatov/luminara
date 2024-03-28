import { getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import {
  createImagePost,
  getImagePostsByUserId,
} from "@/services/post.service";
import { ActionDataResponse } from "@/types/action.types";
import { Post, Image } from "@prisma/client";
import { ImagePostCreateDto } from "@/types/post.types";

type OnGetSelfPostsResponse = ActionDataResponse<{
  posts: (Post & {
    images: Image[];
  })[];
}>;

export const onGetSelfImagePosts =
  async (): Promise<OnGetSelfPostsResponse> => {
    try {
      const self = await getSelf();
      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
      const posts = await getImagePostsByUserId(self.id);
      return {
        success: true,
        data: {
          posts,
        },
      };
    } catch (error) {
      console.error("onGetSelfImagePosts", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };

type OnCreateImagePostResponse = ActionDataResponse<{
  post: Post;
}>;

export const onCreateImagePost = async (
  imagePostCreateDto: Omit<ImagePostCreateDto, "userId">
): Promise<OnCreateImagePostResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const post = await createImagePost({
      ...imagePostCreateDto,
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
    console.error("onCreateImagePost", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
