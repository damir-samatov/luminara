"use server";
import { db } from "@/lib/db";

export const getBan = async (userId: string, bannedId: string) => {
  try {
    return await db.ban.findUnique({
      where: {
        userId_bannedId: {
          userId,
          bannedId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createBan = async (userId: string, bannedId: string) => {
  return db.ban.create({
    data: {
      userId,
      bannedId,
    },
  });
};

export const deleteBan = async (userId: string, bannedId: string) => {
  return db.ban.delete({
    where: {
      userId_bannedId: {
        userId,
        bannedId,
      },
    },
  });
};
