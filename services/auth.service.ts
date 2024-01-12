"use server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const getSelf = async () => {
  const session = auth();

  if (!session || !session.userId) {
    throw new Error("Current user is not logged in");
  }

  const user = await db.user.findUnique({
    where: {
      externalUserId: session.userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
