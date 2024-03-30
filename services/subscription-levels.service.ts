"use server";
import { db } from "@/lib/db";
import { SubscriptionLevelCreateDto } from "@/types/subscription-levels.types";

export const getSubscriptionLevelById = async (id: string) => {
  try {
    return await db.subscriptionLevel.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("getSubscriptionLevelById", error);
    return null;
  }
};

export const getSubscriptionLevels = async (userId: string) => {
  try {
    return await db.subscriptionLevel.findMany({
      where: {
        userId,
      },
      orderBy: {
        price: "asc",
      },
    });
  } catch (error) {
    console.error("getSubscriptionLevels", error);
    return null;
  }
};

type CreateSubscriptionLevelProps = {
  subscriptionLevelCreateDto: SubscriptionLevelCreateDto;
  userId: string;
};

export const createSubscriptionLevel = async ({
  userId,
  subscriptionLevelCreateDto,
}: CreateSubscriptionLevelProps) => {
  try {
    const { title, description, price, imageKey } = subscriptionLevelCreateDto;
    return await db.subscriptionLevel.create({
      data: {
        userId,
        price,
        title,
        description,
        imageKey,
      },
    });
  } catch (error) {
    console.error("createSubscriptionLevel", error);
    return null;
  }
};

type HasRequiredSubscriptionLevelProps = {
  userId: string;
  requiredSubscriptionLevelId?: string | null;
};

export const hasRequiredSubscriptionLevel = async ({
  userId,
  requiredSubscriptionLevelId,
}: HasRequiredSubscriptionLevelProps) => {
  try {
    if (!requiredSubscriptionLevelId) return true;

    const requireSubscriptionLevel = await db.subscriptionLevel.findUnique({
      where: {
        id: requiredSubscriptionLevelId,
      },
    });

    if (!requireSubscriptionLevel) return true;

    const ownerId = requireSubscriptionLevel.userId;

    const userSubscription = await db.subscription.findUnique({
      where: {
        userId_subscriberId: {
          userId: ownerId,
          subscriberId: userId,
        },
      },
      include: {
        subscriptionLevel: true,
      },
    });

    return (
      userSubscription &&
      userSubscription.subscriptionLevel &&
      userSubscription.subscriptionLevel.price >= requireSubscriptionLevel.price
    );
  } catch (error) {
    console.error("hasRequiredSubscriptionLevel", error);
    return false;
  }
};
