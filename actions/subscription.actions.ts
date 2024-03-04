"use server";
import { getSelf } from "@/services/auth.service";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptionsByUserId,
} from "@/services/subscription.service";
import { SubscriptionWithUser } from "@/types/subscription.types";
import { ERROR_RESPONSES, SUCCESS_RESPONSES } from "@/configs/responses.config";
import {
  ActionCombinedResponse,
  ActionDataResponse,
} from "@/types/action.types";
import { revalidatePath } from "next/cache";

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
