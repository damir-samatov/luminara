"use server";
import { getSelf } from "@/services/auth.service";
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  getSubscriptionsByUserId,
  updateSubscriptionActiveLevel,
} from "@/services/subscription.service";
import { SubscriptionWithUser } from "@/types/subscription.types";
import { ERROR_RESPONSES, SUCCESS_RESPONSES } from "@/configs/responses.config";
import {
  ActionCombinedResponse,
  ActionDataResponse,
} from "@/types/action.types";
import { revalidatePath } from "next/cache";
import { getSubscriptionLevelById } from "@/services/subscription-levels.service";
import { Subscription } from "@prisma/client";

type OnChangeSubscriptionResponse = ActionDataResponse<{
  subscription: Subscription;
}>;

export const onChangeSubscriptionLevel = async (
  subscriptionLevelId: string
): Promise<OnChangeSubscriptionResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const subscriptionLevel =
      await getSubscriptionLevelById(subscriptionLevelId);

    if (!subscriptionLevel || self.id === subscriptionLevel.userId)
      return ERROR_RESPONSES.NOT_FOUND;

    const existingSubscription = await getSubscription(
      self.id,
      subscriptionLevel.userId
    );

    if (!existingSubscription) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const subscription = await updateSubscriptionActiveLevel({
      subscriptionId: existingSubscription.id,
      subscriptionLevelId,
    });

    if (!subscription) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/", "page");

    return {
      success: true,
      data: {
        subscription,
      },
    };
  } catch (error) {
    console.error("onChangeSubscriptionLevel", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onSubscribe = async (
  userId: string
): Promise<ActionCombinedResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (self.id === userId) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    await createSubscription(self.id, userId);
    revalidatePath("/", "page");
    return SUCCESS_RESPONSES.SUCCESS;
  } catch (error) {
    console.error("onSubscribe", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onUnsubscribe = async (
  userId: string
): Promise<ActionCombinedResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (self.id === userId) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    await deleteSubscription(self.id, userId);
    revalidatePath("/", "page");
    return SUCCESS_RESPONSES.SUCCESS;
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
      const self = await getSelf();
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
