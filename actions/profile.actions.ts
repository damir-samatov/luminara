"use server";
import { getUserByUsername } from "@/services/user.service";
import { getSelf } from "@/services/auth.service";
import { getSubscription } from "@/services/subscription.service";
import { getBan } from "@/services/ban.service";
import { Post, Subscription, SubscriptionLevel, User } from "@prisma/client";
import { ActionDataResponse } from "@/types/action.types";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getImagePostsByUserId } from "@/services/post.service";
import { getSubscriptionLevels } from "@/services/subscription-levels.service";

type OnGetProfileDataResponse = ActionDataResponse<{
  user: User;
  posts: Post[];
  subscription: Subscription | null;
  subscriptionLevels: SubscriptionLevel[];
}>;

export const onGetProfileData = async (
  username: string
): Promise<OnGetProfileDataResponse> => {
  try {
    const [self, user] = await Promise.all([
      getSelf(),
      getUserByUsername(username),
    ]);
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (!user) return ERROR_RESPONSES.NOT_FOUND;
    const selfBan = await getBan(user.id, self.id);
    if (selfBan) return ERROR_RESPONSES.NOT_FOUND;
    const [subscription, posts, subscriptionLevels] = await Promise.all([
      getSubscription(self.id, user.id),
      getImagePostsByUserId(user.id),
      getSubscriptionLevels(user.id),
    ]);

    if (!subscriptionLevels) return ERROR_RESPONSES.NOT_FOUND;

    return {
      success: true,
      data: {
        posts,
        user,
        subscription,
        subscriptionLevels,
      },
    };
  } catch (error) {
    console.error("onGetProfileData", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
