"use server";
import { ActionDataResponse } from "@/types/action.types";
import { BlogPostDto } from "@/types/post.types";
import { authSelf } from "@/services/auth.service";
import { getUserById, getUserIdByUsername } from "@/services/user.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getSubscriptionWithPlan } from "@/services/subscription.service";
import {
  getBlogPostById,
  getBlogPostsByUserId,
  getBlogPostsByUserIdAndPrice,
  getBlogPostsCountByUserId,
} from "@/services/post.service";
import { getSignedFileReadUrl } from "@/services/s3.service";
import { UserDto } from "@/types/user.types";
import { CommentDto } from "@/types/comment.types";

type OnGetBlogPostsByUserId = (props: {
  username: string;
}) => Promise<
  ActionDataResponse<{ blogPosts: BlogPostDto[]; totalCount: number }>
>;

export const onGetBlogPostsByUsername: OnGetBlogPostsByUserId = async ({
  username,
}) => {
  try {
    const [self, user] = await Promise.all([
      authSelf(),
      getUserIdByUsername(username),
    ]);

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (!user) return ERROR_RESPONSES.NOT_FOUND;

    let accessibleBlogPosts: Awaited<
      ReturnType<typeof getBlogPostsByUserIdAndPrice>
    > = [];

    const totalCount = await getBlogPostsCountByUserId(user.id);
    if (totalCount === null) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    if (self.id === user.id) {
      accessibleBlogPosts = await getBlogPostsByUserId(user.id);
    } else {
      const subscription = await getSubscriptionWithPlan(self.id, user.id);
      if (!subscription)
        return {
          success: true,
          data: {
            blogPosts: [],
            totalCount,
          },
        };
      accessibleBlogPosts = await getBlogPostsByUserIdAndPrice(
        user.id,
        subscription.subscriptionPlan?.price || 0
      );
    }

    const blogPostsDto: BlogPostDto[] = await Promise.all(
      accessibleBlogPosts.map(async (post) => {
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
        totalCount: totalCount,
        blogPosts: blogPostsDto,
      },
    };
  } catch (error) {
    console.error("onGetBlogPostsByUsername", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetBlogPostById = (props: { id: string }) => Promise<
  ActionDataResponse<{
    blogPost: BlogPostDto;
    comments: CommentDto[];
    user: UserDto;
  }>
>;

export const onGetBlogPostByIdAsViewer: OnGetBlogPostById = async ({ id }) => {
  try {
    const [self, blogPost] = await Promise.all([
      authSelf(),
      getBlogPostById(id),
    ]);

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (!blogPost) return ERROR_RESPONSES.NOT_FOUND;

    if (self.id !== blogPost.userId) {
      const subscription = await getSubscriptionWithPlan(
        self.id,
        blogPost.userId
      );
      if (!subscription) return ERROR_RESPONSES.NOT_SUBSCRIBED;

      if (
        blogPost.subscriptionPlan &&
        blogPost.subscriptionPlan.price >
          (subscription.subscriptionPlan?.price || 0)
      )
        return ERROR_RESPONSES.NOT_SUBSCRIBED;

      if (
        blogPost.subscriptionPlan &&
        blogPost.subscriptionPlan.price >
          (subscription.subscriptionPlan?.price || 0)
      )
        return ERROR_RESPONSES.NOT_SUBSCRIBED;
    }

    const [user, imageUrl] = await Promise.all([
      getUserById(blogPost.userId),
      getSignedFileReadUrl(blogPost.images[0]?.key || ""),
    ]);

    if (!user) return ERROR_RESPONSES.NOT_FOUND;

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
        comments: blogPost.comments,
        user: {
          id: user.id,
          username: user.username,
          imageUrl: user.imageUrl,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
        },
      },
    };
  } catch (error) {
    console.error("onGetBlogPostByIdAsViewer", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
