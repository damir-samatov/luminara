"use server";

import { db } from "@/lib/db";

export const getRecommendationsByUserId = async (userId: string) => {
  try {
    return await db.user.findMany({
      take: 10,
      where: {
        subscribedBy: {
          none: {
            subscriberId: userId,
          },
        },
        banned: {
          none: {
            bannedUserId: userId,
          },
        },
        NOT: {
          id: userId,
        },
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
