"use server";
import { db } from "@/lib/db";

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
    console.error(error);
    return null;
  }
};

export const createSubscription = async (
  subscriberId: string,
  userId: string
) => {
  return db.subscription.create({
    data: {
      userId,
      subscriberId,
    },
  });
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

export const getSubscriptionsByUserId = async (userId: string) => {
  try {
    return await db.subscription.findMany({
      take: 10,
      where: {
        subscriberId: userId,
        user: {
          banned: {
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
    console.error(error);
    return [];
  }
};
