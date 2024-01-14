"use server";
import { getSelf } from "@/services/auth.service";
import { createBan, deleteBan } from "@/services/ban.service";
import { revalidatePath } from "next/cache";

const RESPONSES = {
  UNAUTHORIZED: {
    success: false,
    message: "Unauthorized",
  },
  BAN_SELF: {
    success: false,
    message: "You can't ban yourself.",
  },
  BAN_SUCCESS: {
    success: true,
    message: "You banned this user.",
  },
  BAN_FAILED: {
    success: false,
    message: "Failed to ban. Please try again later.",
  },
  UNBAN_SELF: {
    success: false,
    message: "You can't unban yourself.",
  },
  UNBAN_SUCCESS: {
    success: true,
    message: "You unbanned this user.",
  },
  UNBAN_FAILED: {
    success: false,
    message: "Failed to unban. Please try again later.",
  },
};

export const onBan = async (userId: string) => {
  const self = await getSelf();
  if (!self) return RESPONSES.UNAUTHORIZED;
  if (self.id === userId) return RESPONSES.BAN_SELF;

  try {
    await createBan(self.id, userId);
    revalidatePath("/");
    return RESPONSES.BAN_SUCCESS;
  } catch (error) {
    console.error("onBan", error);
    return RESPONSES.BAN_FAILED;
  }
};

export const onUnban = async (userId: string) => {
  const self = await getSelf();
  if (!self) return RESPONSES.UNAUTHORIZED;
  if (self.id === userId) return RESPONSES.UNBAN_SELF;

  try {
    await deleteBan(self.id, userId);
    revalidatePath("/");
    return RESPONSES.UNBAN_SUCCESS;
  } catch (error) {
    console.error("onUnban", error);
    return RESPONSES.UNBAN_FAILED;
  }
};
