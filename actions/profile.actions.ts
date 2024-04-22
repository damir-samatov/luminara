"use server";
import { getUserByUsername } from "@/services/user.service";
import { getSelf } from "@/services/auth.service";
import { getSubscription } from "@/services/subscription.service";
import { getBan } from "@/services/ban.service";
import { Post, Subscription, SubscriptionPlan, User } from "@prisma/client";
import { ActionDataResponse } from "@/types/action.types";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getBlogPostsByUserId } from "@/services/post.service";
import { getSubscriptionPlansByUserId } from "@/services/subscription-plan.service";

type OnGetProfileDataResponse = ActionDataResponse<{
  user: User;
  posts: Post[];
  subscription: Subscription | null;
  subscriptionPlans: SubscriptionPlan[];
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
    const [subscription, posts, subscriptionPlans] = await Promise.all([
      getSubscription(self.id, user.id),
      getBlogPostsByUserId(user.id),
      getSubscriptionPlansByUserId(user.id),
    ]);

    if (!subscriptionPlans) return ERROR_RESPONSES.NOT_FOUND;

    return {
      success: true,
      data: {
        posts,
        user,
        subscription,
        subscriptionPlans,
      },
    };
  } catch (error) {
    console.error("onGetProfileData", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
