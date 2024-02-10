"use server";
import { auth } from "@clerk/nextjs";
import { getUserByExternalUserId } from "@/services/user.service";
import { poll } from "@/utils/async.utils";

export const getSelf = async () => {
  try {
    const session = auth();

    if (!session || !session.userId) return null;

    const user = await poll({
      attempts: 5,
      interval: 2000,
      callback: async () => await getUserByExternalUserId(session.userId),
      successCallback: (user) => !!user,
    });

    if (!user) return null;

    return user;
  } catch (error) {
    console.error("getSelf", error);
    return null;
  }
};
