"use server";
import { db } from "@/lib/db";

export const getBan = async (userId: string, bannedUserId: string) => {
  try {
    return await db.ban.findUnique({
      where: {
        userId_bannedUserId: {
          userId,
          bannedUserId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createBan = async (userId: string, bannedUserId: string) => {
  return db.ban.create({
    data: {
      userId,
      bannedUserId,
    },
  });
};

export const deleteBan = async (userId: string, bannedUserId: string) => {
  return db.ban.delete({
    where: {
      userId_bannedUserId: {
        userId,
        bannedUserId,
      },
    },
  });
};
