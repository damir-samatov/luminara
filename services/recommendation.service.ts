"use server";
import { db } from "@/lib/db";

export const getRecommendedUsersByUserId = async (userId: string) => {
  try {
    return await db.user.findMany({
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
      select: {
        id: true,
        username: true,
        imageUrl: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("getRecommendedUsersByUserId", error);
    return null;
  }
};
