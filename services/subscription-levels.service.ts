"use server";
import { db } from "@/lib/db";
import { SubscriptionLevelUpdateContentDto } from "@/types/subscription-levels.types";

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

export const getSubscriptionLevelsByUserId = async (userId: string) => {
  try {
    return await db.subscriptionLevel.findMany({
      where: {
        userId,
      },
      orderBy: {
        price: "desc",
      },
    });
  } catch (error) {
    console.error("getSubscriptionLevelsByUserId", error);
    return null;
  }
};

type CreateSubscriptionLevelProps = {
  userId: string;
  title: string;
  description: string;
  price: number;
  imageKey: string;
};

export const createSubscriptionLevel = async ({
  userId,
  price,
  title,
  description,
  imageKey,
}: CreateSubscriptionLevelProps) => {
  try {
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

type UpdateSubscriptionLevelProps = {
  userId: string;
  subscriptionLevelId: string;
  subscriptionLevelUpdateContentDto: SubscriptionLevelUpdateContentDto;
};

export const updateSubscriptionLevelContent = async ({
  userId,
  subscriptionLevelId,
  subscriptionLevelUpdateContentDto,
}: UpdateSubscriptionLevelProps) => {
  try {
    return await db.subscriptionLevel.update({
      where: {
        id: subscriptionLevelId,
        userId,
      },
      data: {
        title: subscriptionLevelUpdateContentDto.title,
        description: subscriptionLevelUpdateContentDto.description,
      },
      select: {
        title: true,
        description: true,
      },
    });
  } catch (error) {
    console.error("updateSubscriptionLevel", error);
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

export const deleteSubscriptionLevelById = async (
  subscriptionLevelId: string
) => {
  try {
    return await db.subscriptionLevel.delete({
      where: {
        id: subscriptionLevelId,
      },
    });
  } catch (error) {
    console.error("deleteSubscriptionLevelById", error);
    return null;
  }
};
