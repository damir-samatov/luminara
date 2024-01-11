"use server";

import { getSelf } from "@/services/auth.service";
import {
  createSubscription,
  deleteSubscription,
} from "@/services/subscription.service";

export const onSubscribe = async (userId: string) => {
  try {
    const user = await getSelf();
    if (user.id === userId) {
      return {
        success: false,
        message: "You can't subscribe to yourself.",
      };
    }
    await createSubscription(user.id, userId);

    return {
      success: true,
      message: "You subscribed to this user.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to subscribe. Please try again later.",
    };
  }
};

export const onUnsubscribe = async (userId: string) => {
  try {
    const user = await getSelf();

    await deleteSubscription(user.id, userId);

    return {
      success: true,
      message: "You unsubscribed from this user.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to unsubscribe. Please try again later.",
    };
  }
};
