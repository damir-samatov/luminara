"use server";
import { getUserByUsername } from "@/services/user.service";
import { getSelf } from "@/services/auth.service";
import { getSubscription } from "@/services/subscription.service";
import { getBan } from "@/services/ban.service";
import { User } from ".prisma/client";
import { notFound } from "next/navigation";

const RESPONSES: {
  UNAUTHORIZED: {
    success: false;
    message: string;
  };
  USER_NOT_FOUND: {
    success: false;
    message: string;
  };
} = {
  UNAUTHORIZED: {
    success: false,
    message: "Unauthorized",
  },
  USER_NOT_FOUND: {
    success: false,
    message: "User not found.",
  },
};

type GetProfileDataResponse =
  | {
      success: true;
      data: {
        user: User;
        isSubscribed: boolean;
        isBanned: boolean;
      };
    }
  | (typeof RESPONSES)[keyof typeof RESPONSES];

export const getProfileData = async (
  username: string
): Promise<GetProfileDataResponse> => {
  const [self, user] = await Promise.all([
    getSelf(),
    getUserByUsername(username),
  ]);

  if (!self) return RESPONSES.UNAUTHORIZED;

  if (!user) return RESPONSES.USER_NOT_FOUND;

  if (self.id === user.id) notFound();

  const [subscription, ban] = await Promise.all([
    getSubscription(self.id, user.id),
    getBan(self.id, user.id),
  ]);

  return {
    success: true,
    data: {
      user,
      isSubscribed: !!subscription,
      isBanned: !!ban,
    },
  };
};
