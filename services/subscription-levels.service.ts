"use server";
import { db } from "@/lib/db";
import { SubscriptionLevelCreateDto } from "@/types/subscription-levels.types";

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
