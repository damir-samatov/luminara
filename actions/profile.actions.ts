"use server";
import { getUserByUsername } from "@/services/user.service";
import { authSelf } from "@/services/auth.service";
import { getSubscription } from "@/services/subscription.service";
import { getBan } from "@/services/ban.service";
import { Subscription } from "@prisma/client";
import { ActionDataResponse } from "@/types/action.types";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getSubscriptionPlansByUserId } from "@/services/subscription-plan.service";
import { getStreamByUserId } from "@/services/stream.service";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { getSignedFileReadUrl } from "@/services/s3.service";
import { UserDto } from "@/types/user.types";

type OnGetProfileDataResponse = ActionDataResponse<{
  user: UserDto;
  isLive: boolean;
  subscription: Subscription | null;
  subscriptionPlans: SubscriptionPlanDto[];
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

    if (!subscriptionPlans) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const subscriptionPlansWithImageUrls = await Promise.all(
      subscriptionPlans.map(async (subscriptionPlan) => {
        const imageUrl = await getSignedFileReadUrl(subscriptionPlan.imageKey);
        return {
          ...subscriptionPlan,
          imageUrl,
        };
      })
    );

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
        },
        isLive: stream?.isLive || false,
        subscription,
        subscriptionPlans: subscriptionPlansWithImageUrls,
      },
    };
  } catch (error) {
    console.error("onGetProfileData", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
