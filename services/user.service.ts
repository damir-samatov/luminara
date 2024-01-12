"use server";
import { db } from "@/lib/db";

export const getUserById = async (id: string) => {
  try {
    return await db.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserByExternalUserId = async (externalUserId: string) => {
  try {
    return await db.user.findUnique({
      where: {
        externalUserId,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    return await db.user.findFirst({
      where: {
        username,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};
