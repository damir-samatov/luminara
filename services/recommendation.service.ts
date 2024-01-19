"use server";

import { db } from "@/lib/db";

export const getRecommendationsByUserId = async (userId: string) => {
  try {
    return await db.user.findMany({
      take: 20,
      where: {
        subscribedBy: {
          none: {
            subscriberId: userId,
          },
        },
        bannedUsers: {
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
    console.error("getRecommendationsByUserId", error);
    return null;
  }
};
