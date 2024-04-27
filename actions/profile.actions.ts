"use server";
import { getUserByUsername } from "@/services/user.service";
import { authSelf } from "@/services/auth.service";
import { getSubscription } from "@/services/subscription.service";
import { getBan } from "@/services/ban.service";
import { Subscription, SubscriptionPlan, User } from "@prisma/client";
import { ActionDataResponse } from "@/types/action.types";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getSubscriptionPlansByUserId } from "@/services/subscription-plan.service";
import { getStreamByUserId } from "@/services/stream.service";

type OnGetProfileDataResponse = ActionDataResponse<{
  user: User;
  isLive: boolean;
  subscription: Subscription | null;
  subscriptionPlans: SubscriptionPlan[];
}>;

export const onGetProfileData = async (
  username: string
): Promise<OnGetProfileDataResponse> => {
  try {
    const [self, user] = await Promise.all([
      authSelf(),
      getUserByUsername(username),
    ]);

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (!user) return ERROR_RESPONSES.NOT_FOUND;

    if (self.id !== user.id) {
      const selfBan = await getBan(user.id, self.id);
      if (selfBan) return ERROR_RESPONSES.NOT_FOUND;
    }

    const [subscription, subscriptionPlans, stream] = await Promise.all([
      getSubscription(self.id, user.id),
      getSubscriptionPlansByUserId(user.id),
      getStreamByUserId(user.id),
    ]);

    if (!subscriptionPlans) return ERROR_RESPONSES.NOT_FOUND;

    return {
      success: true,
      data: {
        user,
        isLive: stream?.isLive || false,
        subscription,
        subscriptionPlans,
      },
    };
  } catch (error) {
    console.error("onGetProfileData", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
