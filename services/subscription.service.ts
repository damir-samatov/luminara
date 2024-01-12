"use server";
import { db } from "@/lib/db";

export const getSubscription = async (userId: string, subscriberId: string) => {
  return db.subscription.findFirst({
    where: {
      userId,
      subscriberId,
    },
  });
};

export const createSubscription = async (
  userId: string,
  subscriberId: string
) => {
  return db.subscription.create({
    data: {
      userId,
      subscriberId,
    },
  });
};

export const deleteSubscription = async (
  userId: string,
  subscriberId: string
) => {
  return db.subscription.create({
    data: {
      userId,
      subscriberId,
    },
  });
};
