import { ActionDataResponse } from "@/types/action.types";
import { VideoPostDto } from "@/types/post.types";
import { authSelf } from "@/services/auth.service";
import { getUserById, getUserIdByUsername } from "@/services/user.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getSubscriptionWithPlan } from "@/services/subscription.service";
import {
  getVideoPostById,
  getVideoPostsByUserId,
  getVideoPostsByUserIdAndPrice,
} from "@/services/post.service";
import { getSignedFileReadUrl } from "@/services/s3.service";
import { UserDto } from "@/types/user.types";
import { CommentDto } from "@/types/comment.types";

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
      if (!subscription)
        return {
          success: true,
          data: {
            videoPosts: [],
          },
        };

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

type OnGetVideoPostById = (props: { id: string }) => Promise<
  ActionDataResponse<{
    videoPost: VideoPostDto;
    comments: CommentDto[];
    user: UserDto;
  }>
>;

export const onGetVideoPostByIdAsViewer: OnGetVideoPostById = async ({
  id,
}) => {
  try {
    const [self, videoPost] = await Promise.all([
      authSelf(),
      getVideoPostById(id),
    ]);

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (!videoPost) return ERROR_RESPONSES.NOT_FOUND;

    if (self.id !== videoPost.userId) {
      const subscription = await getSubscriptionWithPlan(
        self.id,
        videoPost.userId
      );
      if (!subscription) return ERROR_RESPONSES.NOT_SUBSCRIBED;

      if (
        videoPost.subscriptionPlan &&
        videoPost.subscriptionPlan.price >
          (subscription.subscriptionPlan?.price || 0)
      )
        return ERROR_RESPONSES.NOT_SUBSCRIBED;

      if (
        videoPost.subscriptionPlan &&
        videoPost.subscriptionPlan.price >
          (subscription.subscriptionPlan?.price || 0)
      )
        return ERROR_RESPONSES.NOT_SUBSCRIBED;
    }

    const [user, videoUrl, thumbnailUrl] = await Promise.all([
      getUserById(videoPost.userId),
      getSignedFileReadUrl(videoPost.videos[0]?.key || ""),
      getSignedFileReadUrl(videoPost.videos[0]?.thumbnailKey || ""),
    ]);

    if (!user) return ERROR_RESPONSES.NOT_FOUND;

    return {
      success: true,
      data: {
        videoPost: {
          id: videoPost.id,
          title: videoPost.title,
          body: videoPost.body,
          thumbnailUrl,
          videoUrl,
          subscriptionPlan: videoPost.subscriptionPlan,
          createdAt: videoPost.createdAt,
          updatedAt: videoPost.updatedAt,
        },
        comments: videoPost.comments,
        user: {
          id: user.id,
          username: user.username,
          imageUrl: user.imageUrl,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    };
  } catch (error) {
    console.error("onGetVideoPostByIdAsViewer", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
