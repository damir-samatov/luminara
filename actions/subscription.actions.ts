"use server";
import { getSelf } from "@/services/auth.service";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptionsByUserId,
} from "@/services/subscription.service";
import { revalidatePath } from "next/cache";

const RESPONSES = {
  UNAUTHORIZED: {
    success: false,
    message: "Unauthorized",
  },
  SUBSCRIBE_SELF: {
    success: false,
    message: "You can't subscribed to yourself.",
  },
  SUBSCRIBE_SUCCESS: {
    success: true,
    message: "You subscribed to this user.",
  },
  SUBSCRIBE_FAILED: {
    success: false,
    message: "Failed to subscribe. Please try again later.",
  },
  UNSUBSCRIBE_SELF: {
    success: false,
    message: "You can't unsubscribe from yourself.",
  },
  UNSUBSCRIBE_SUCCESS: {
    success: true,
    message: "You unsubscribe from this user.",
  },
  UNSUBSCRIBE_FAILED: {
    success: false,
    message: "Failed to unsubscribe. Please try again later.",
  },
};

export const onSubscribe = async (userId: string) => {
  const self = await getSelf();
  if (!self) return RESPONSES.UNAUTHORIZED;
  if (self.id === userId) return RESPONSES.SUBSCRIBE_SELF;

  try {
    await createSubscription(self.id, userId);
    revalidatePath("/");
    return RESPONSES.SUBSCRIBE_SUCCESS;
  } catch (error) {
    console.error("onSubscribe", error);
    return RESPONSES.SUBSCRIBE_FAILED;
  }
};

export const onUnsubscribe = async (userId: string) => {
  const self = await getSelf();
  if (!self) return RESPONSES.UNAUTHORIZED;
  if (self.id === userId) return RESPONSES.UNSUBSCRIBE_SELF;

  try {
    await deleteSubscription(self.id, userId);
    revalidatePath("/");
    return RESPONSES.UNSUBSCRIBE_SUCCESS;
  } catch (error) {
    console.error("onUnsubscribe", error);
    return RESPONSES.UNSUBSCRIBE_FAILED;
  }
};

export const getSubscriptions = async () => {
  const self = await getSelf();

  if (!self) return [];

  return await getSubscriptionsByUserId(self.id);
};
