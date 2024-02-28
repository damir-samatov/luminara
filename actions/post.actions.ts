import { getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { createPost, getPostsByUserId } from "@/services/post.service";
import { ActionDataResponse } from "@/types/action.types";
import { Post, Image } from ".prisma/client";
import { PostCreateDto } from "@/types/post.types";

type OnGetSelfPosts = ActionDataResponse<{
  posts: (Post & {
    images: Image[];
  })[];
}>;

export const onGetSelfPosts = async (): Promise<OnGetSelfPosts> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const posts = await getPostsByUserId(self.id);
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

type OnCreatePost = ActionDataResponse<{
  post: Post;
}>;

export const onCreatePost = async (
  postCreateDto: Omit<PostCreateDto, "userId">
): Promise<OnCreatePost> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const post = await createPost({ ...postCreateDto, userId: self.id });
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
