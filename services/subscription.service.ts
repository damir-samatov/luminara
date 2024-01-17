"use server";
import { db } from "@/lib/db";
import { SubscriptionWithUser } from "@/types/subscription.types";

export const getSubscription = async (subscriberId: string, userId: string) => {
  try {
    return await db.subscription.findUnique({
      where: {
        userId_subscriberId: {
          userId,
          subscriberId,
        },
      },
    });
  } catch (error) {
    console.error("getSubscription", error);
    return null;
  }
};

export const createSubscription = async (
  subscriberId: string,
  userId: string
) => {
  try {
    return await db.subscription.create({
      data: {
        userId,
        subscriberId,
      },
    });
  } catch (error) {
    console.error("createSubscription", error);
    return null;
  }
};

export const deleteSubscription = async (
  subscriberId: string,
  userId: string
) => {
  return db.subscription.delete({
    where: {
      userId_subscriberId: {
        userId,
        subscriberId,
      },
    },
  });
};

export const getSubscriptionsByUserId = async (
  userId: string
): Promise<SubscriptionWithUser[]> => {
  try {
    return await db.subscription.findMany({
      take: 10,
      where: {
        subscriberId: userId,
        user: {
          bannedUsers: {
            none: {
              bannedUserId: userId,
            },
          },
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("getSubscriptionsByUserId", error);
    return [];
  }
};
