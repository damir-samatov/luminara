"use server";
import { authSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { createBlogPost, getBlogPostsByUserId } from "@/services/post.service";
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
}>;

export const onGetSelfBlogPosts = async (): Promise<OnGetSelfPostsResponse> => {
  try {
    const self = await authSelf();
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
          imageUrl: imageUrl || "",
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
        title,
        key: imageKey,
      },
    });

    if (!post) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/posts");

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
