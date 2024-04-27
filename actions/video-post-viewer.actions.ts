import { ActionDataResponse } from "@/types/action.types";
import { VideoPostDto } from "@/types/post.types";
import { authSelf } from "@/services/auth.service";
import { getUserIdByUsername } from "@/services/user.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getSubscriptionWithPlan } from "@/services/subscription.service";
import {
  getVideoPostsByUserId,
  getVideoPostsByUserIdAndPrice,
} from "@/services/post.service";
import { getSignedFileReadUrl } from "@/services/s3.service";

type OnGetBlogPostsByUserId = (props: {
  username: string;
}) => Promise<ActionDataResponse<{ videoPosts: VideoPostDto[] }>>;

export const onGetVideoPostsByUsername: OnGetBlogPostsByUserId = async ({
  username,
}) => {
  try {
    const [self, user] = await Promise.all([
      authSelf(),
      getUserIdByUsername(username),
    ]);

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (!user) return ERROR_RESPONSES.NOT_FOUND;

    let accessibleVideoPosts: Awaited<
      ReturnType<typeof getVideoPostsByUserIdAndPrice>
    > = [];

    if (self.id === user.id) {
      accessibleVideoPosts = await getVideoPostsByUserId(user.id);
    } else {
      const subscription = await getSubscriptionWithPlan(self.id, user.id);
      if (!subscription) return ERROR_RESPONSES.NOT_SUBSCRIBED;

      accessibleVideoPosts = await getVideoPostsByUserIdAndPrice(
        user.id,
        subscription.subscriptionPlan?.price || 0
      );
    }

    const videoPostsDto: VideoPostDto[] = await Promise.all(
      accessibleVideoPosts.map(async (post) => {
        const video = post.videos[0];
        const [thumbnailUrl, videoUrl] = await Promise.all([
          getSignedFileReadUrl(video?.thumbnailKey || ""),
          getSignedFileReadUrl(video?.key || ""),
        ]);
        return {
          id: post.id,
          title: post.title,
          body: post.body,
          thumbnailUrl,
          videoUrl,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          subscriptionPlan: post.subscriptionPlan,
        };
      })
    );

    return {
      success: true,
      data: {
        videoPosts: videoPostsDto,
      },
    };
  } catch (error) {
    console.error("onGetVideoPostsByUsername", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
