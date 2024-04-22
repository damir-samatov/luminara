"use server";
import { auth } from "@clerk/nextjs";
import {
  getUserByExternalUserId,
  getUserIdByExternalUserId,
} from "@/services/user.service";
import { poll } from "@/utils/async.utils";

export const getSelf = async () => {
  try {
    const session = auth();

    if (!session || !session.userId) return null;

    return await poll({
      attempts: 5,
      interval: 2000,
      callback: async () => await getUserByExternalUserId(session.userId),
      successCallback: (user) => !!user,
    });
  } catch (error) {
    console.error("getSelf", error);
    return null;
  }
};

export const authSelf = async () => {
  try {
    const session = auth();

    if (!session || !session.userId) return null;

    return await poll({
      attempts: 5,
      interval: 2000,
      callback: async () => await getUserIdByExternalUserId(session.userId),
      successCallback: (user) => user !== null,
    });
  } catch (error) {
    console.error("authSelf", error);
    return null;
  }
};
