"use server";
import { authSelf } from "@/services/auth.service";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptionsByUserId,
  updateSubscriptionActivePlan,
  getSubscriptionById,
} from "@/services/subscription.service";
import { SubscriptionWithUser } from "@/types/subscription.types";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { ActionDataResponse } from "@/types/action.types";
import { getSubscriptionPlanById } from "@/services/subscription-plan.service";
import { Subscription } from "@prisma/client";

type OnChangeSubscriptionPlan = (props: {
  subscriptionId: string;
  subscriptionPlanId: string | null;
}) => Promise<
  ActionDataResponse<{
    subscription: Subscription;
  }>
>;

export const onChangeSubscriptionPlan: OnChangeSubscriptionPlan = async ({
  subscriptionId,
  subscriptionPlanId,
}) => {
  try {
    const [self, existingSubscription] = await Promise.all([
      authSelf(),
      getSubscriptionById(subscriptionId),
    ]);

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (!existingSubscription) return ERROR_RESPONSES.NOT_FOUND;

    if (self.id !== existingSubscription.subscriberId)
      return ERROR_RESPONSES.UNAUTHORIZED;

    if (subscriptionPlanId !== null) {
      const subscriptionPlan =
        await getSubscriptionPlanById(subscriptionPlanId);
      if (!subscriptionPlan) return ERROR_RESPONSES.NOT_FOUND;
    }

    const subscription = await updateSubscriptionActivePlan({
      subscriptionId: existingSubscription.id,
      subscriptionPlanId,
    });

    if (!subscription) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        subscription,
      },
    };
  } catch (error) {
    console.error("onChangeSubscriptionPlan", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnSubscribe = (
  userId: string
) => Promise<ActionDataResponse<{ subscription: Subscription }>>;

export const onSubscribe: OnSubscribe = async (userId) => {
  try {
    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (self.id === userId) return ERROR_RESPONSES.SELF_SUBSCRIPTION;

    const subscription = await createSubscription(self.id, userId);
    if (!subscription) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        subscription,
      },
    };
  } catch (error) {
    console.error("onSubscribe", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnUnsubscribe = (
  userId: string
) => Promise<ActionDataResponse<{ subscription: Subscription }>>;

export const onUnsubscribe: OnUnsubscribe = async (userId) => {
  try {
    const self = await authSelf();

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (self.id === userId) return ERROR_RESPONSES.SELF_SUBSCRIPTION;

    const subscription = await deleteSubscription(self.id, userId);
    if (!subscription) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        subscription,
      },
    };
  } catch (error) {
    console.error("onUnsubscribe", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetSubscriptionsResponse = ActionDataResponse<{
  subscriptions: SubscriptionWithUser[];
}>;

export const onGetSubscriptions =
  async (): Promise<OnGetSubscriptionsResponse> => {
    try {
      const self = await authSelf();
      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

      const subscriptions = await getSubscriptionsByUserId(self.id);

      return {
        success: true,
        data: {
          subscriptions,
        },
      };
    } catch (error) {
      console.error("onGetSubscriptions", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };
