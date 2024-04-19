"use server";
import { db } from "@/lib/db";
import { SubscriptionPlanUpdateContentDto } from "@/types/subscription-plan.types";

export const getSubscriptionPlanById = async (id: string) => {
  try {
    return await db.subscriptionPlan.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("getSubscriptionPlanById", error);
    return null;
  }
};

export const getSubscriptionPlansByUserId = async (userId: string) => {
  try {
    return await db.subscriptionPlan.findMany({
      where: {
        userId,
      },
      orderBy: {
        price: "desc",
      },
    });
  } catch (error) {
    console.error("getSubscriptionPlansByUserId", error);
    return null;
  }
};

type CreateSubscriptionPlanProps = {
  userId: string;
  title: string;
  description: string;
  price: number;
  imageKey: string;
};

export const createSubscriptionPlan = async ({
  userId,
  price,
  title,
  description,
  imageKey,
}: CreateSubscriptionPlanProps) => {
  try {
    return await db.subscriptionPlan.create({
      data: {
        userId,
        price,
        title,
        description,
        imageKey,
      },
    });
  } catch (error) {
    console.error("createSubscriptionPlan", error);
    return null;
  }
};

type UpdateSubscriptionPlanProps = {
  userId: string;
  subscriptionPlanId: string;
  subscriptionPlanUpdateContentDto: SubscriptionPlanUpdateContentDto;
};

export const updateSubscriptionPlanContent = async ({
  userId,
  subscriptionPlanId,
  subscriptionPlanUpdateContentDto,
}: UpdateSubscriptionPlanProps) => {
  try {
    return await db.subscriptionPlan.update({
      where: {
        id: subscriptionPlanId,
        userId,
      },
      data: {
        title: subscriptionPlanUpdateContentDto.title,
        description: subscriptionPlanUpdateContentDto.description,
      },
      select: {
        title: true,
        description: true,
      },
    });
  } catch (error) {
    console.error("updateSubscriptionPlan", error);
    return null;
  }
};

type HasRequiredSubscriptionPlanProps = {
  userId: string;
  requiredSubscriptionPlanId?: string | null;
};

export const hasRequiredSubscriptionPlan = async ({
  userId,
  requiredSubscriptionPlanId,
}: HasRequiredSubscriptionPlanProps) => {
  try {
    if (!requiredSubscriptionPlanId) return true;

    const requireSubscriptionPlan = await db.subscriptionPlan.findUnique({
      where: {
        id: requiredSubscriptionPlanId,
      },
    });

    if (!requireSubscriptionPlan) return true;

    const ownerId = requireSubscriptionPlan.userId;

    const userSubscription = await db.subscription.findUnique({
      where: {
        userId_subscriberId: {
          userId: ownerId,
          subscriberId: userId,
        },
      },
      include: {
        subscriptionPlan: true,
      },
    });

    return (
      userSubscription &&
      userSubscription.subscriptionPlan &&
      userSubscription.subscriptionPlan.price >= requireSubscriptionPlan.price
    );
  } catch (error) {
    console.error("hasRequiredSubscriptionPlan", error);
    return false;
  }
};

export const deleteSubscriptionPlanById = async (
  subscriptionPlanId: string
) => {
  try {
    return await db.subscriptionPlan.delete({
      where: {
        id: subscriptionPlanId,
      },
    });
  } catch (error) {
    console.error("deleteSubscriptionPlanById", error);
    return null;
  }
};
