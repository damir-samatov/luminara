"use server";
import { authSelf, getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import {
  createBlogPost,
  getBlogPostById,
  getBlogPostsByUserId,
} from "@/services/post.service";
import { ActionDataResponse } from "@/types/action.types";
import { BlogPostCreateDto, BlogPostDto } from "@/types/post.types";
import {
  BLOG_POST_IMAGE_MAX_SIZE,
  ELIGIBLE_IMAGE_TYPES,
} from "@/configs/file.config";
import { getSubscriptionPlanById } from "@/services/subscription-plan.service";
import { generateFileKey } from "@/helpers/server/s3.helpers";
import {
  getSignedFileReadUrl,
  getSignedFileUploadUrl,
} from "@/services/s3.service";
import { revalidatePath } from "next/cache";

type OnGetSelfPostsResponse = ActionDataResponse<{
  blogPosts: BlogPostDto[];
  username: string;
}>;

export const onGetSelfBlogPosts = async (): Promise<OnGetSelfPostsResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const posts = await getBlogPostsByUserId(self.id);
    const blogPosts = await Promise.all(
      posts.map(async (post) => {
        const image = post.images[0];
        const imageUrl = await getSignedFileReadUrl(image?.key || "");
        return {
          id: post.id,
          title: post.title,
          body: post.body,
          imageUrl,
          subscriptionPlan: post.subscriptionPlan,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        };
      })
    );
    return {
      success: true,
      data: {
        blogPosts,
        username: self.username,
      },
    };
  } catch (error) {
    console.error("onGetSelfBlogPosts", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnCreateBlogPostResponse = ActionDataResponse<{
  imageUploadUrl: string;
}>;

export const onCreateBlogPost = async ({
  title,
  body,
  subscriptionPlanId,
  image,
}: BlogPostCreateDto): Promise<OnCreateBlogPostResponse> => {
  try {
    if (
      image.size > BLOG_POST_IMAGE_MAX_SIZE ||
      !ELIGIBLE_IMAGE_TYPES.includes(image.type) ||
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

    const imageKey = generateFileKey(self.id);

    const imageUploadUrl = await getSignedFileUploadUrl({
      key: imageKey,
      type: image.type,
      size: image.size,
    });

    if (!imageUploadUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const post = await createBlogPost({
      userId: self.id,
      title,
      body,
      subscriptionPlanId,
      image: {
        key: imageKey,
      },
    });

    if (!post) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/posts", "page");

    return {
      success: true,
      data: {
        imageUploadUrl,
      },
    };
  } catch (error) {
    console.error("onCreateBlogPost", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetBlogPostByIdResponse = ActionDataResponse<{
  blogPost: BlogPostDto;
}>;

export const onGetBlogPostById = async (
  id: string
): Promise<OnGetBlogPostByIdResponse> => {
  try {
    const [self, blogPost] = await Promise.all([
      authSelf(),
      getBlogPostById(id),
    ]);

    if (!blogPost) return ERROR_RESPONSES.NOT_FOUND;
    if (!self || blogPost.userId !== self.id)
      return ERROR_RESPONSES.UNAUTHORIZED;

    const image = blogPost.images[0];
    if (!image) return ERROR_RESPONSES.NOT_FOUND;

    const imageUrl = await getSignedFileReadUrl(image.key);

    return {
      success: true,
      data: {
        blogPost: {
          id: blogPost.id,
          title: blogPost.title,
          body: blogPost.body,
          imageUrl,
          subscriptionPlan: blogPost.subscriptionPlan,
          createdAt: blogPost.createdAt,
          updatedAt: blogPost.updatedAt,
        },
      },
    };
  } catch (error) {
    console.error("onGetVideoPostById", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetBlogPostImageUploadUrl = (props: {
  postId: string;
  type: string;
  size: number;
}) => Promise<ActionDataResponse<{ uploadUrl: string }>>;

export const onGetBlogPostImageUploadUrl: OnGetBlogPostImageUploadUrl = async ({
  postId,
  type,
  size,
}) => {
  try {
    if (size > BLOG_POST_IMAGE_MAX_SIZE || !ELIGIBLE_IMAGE_TYPES.includes(type))
      return ERROR_RESPONSES.BAD_REQUEST;

    const [self, post] = await Promise.all([
      authSelf(),
      getBlogPostById(postId),
    ]);

    if (!post) return ERROR_RESPONSES.NOT_FOUND;
    if (!self || post.userId !== self.id) return ERROR_RESPONSES.UNAUTHORIZED;
    const image = post.images[0];
    if (!image) return ERROR_RESPONSES.NOT_FOUND;

    const uploadUrl = await getSignedFileUploadUrl({
      key: image.key,
      type,
      size,
    });

    if (!uploadUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/posts", "page");
    revalidatePath(`/posts/${postId}`, "page");

    return {
      success: true,
      data: {
        uploadUrl,
      },
    };
  } catch (error) {
    console.error("onGetBlogPostImageUploadUrl", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
