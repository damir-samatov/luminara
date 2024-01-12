"use server";
import { auth } from "@clerk/nextjs";
import { getUserByExternalUserId } from "@/services/user.service";

export const getSelf = async () => {
  try {
    const session = auth();

    if (!session || !session.userId) return null;

    const user = await getUserByExternalUserId(session.userId);

    if (!user) return null;

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
