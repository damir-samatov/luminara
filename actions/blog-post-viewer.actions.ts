import { ActionDataResponse } from "@/types/action.types";
import { BlogPostDto } from "@/types/post.types";
import { authSelf } from "@/services/auth.service";
import { getUserIdByUsername } from "@/services/user.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getSubscriptionWithPlan } from "@/services/subscription.service";
import {
  getBlogPostsByUserId,
  getBlogPostsByUserIdAndPrice,
} from "@/services/post.service";
import { getSignedFileReadUrl } from "@/services/s3.service";

type OnGetBlogPostsByUserId = (props: {
  username: string;
}) => Promise<ActionDataResponse<{ blogPosts: BlogPostDto[] }>>;

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

    if (self.id === user.id) {
      accessibleBlogPosts = await getBlogPostsByUserId(user.id);
    } else {
      const subscription = await getSubscriptionWithPlan(self.id, user.id);
      if (!subscription) return ERROR_RESPONSES.NOT_SUBSCRIBED;

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
        blogPosts: blogPostsDto,
      },
    };
  } catch (error) {
    console.error("onGetBlogPostsByUsername", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
