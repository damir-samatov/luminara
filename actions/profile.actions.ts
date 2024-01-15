"use server";
import { getUserByUsername } from "@/services/user.service";
import { getSelf } from "@/services/auth.service";
import { getSubscription } from "@/services/subscription.service";
import { getBan } from "@/services/ban.service";
import { Stream, User } from ".prisma/client";
import { getStreamByUserId } from "@/services/stream.service";

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
        stream: Stream;
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

  const stream = await getStreamByUserId(user.id);

  if (!stream) return RESPONSES.USER_NOT_FOUND;

  const [subscription, ban] = await Promise.all([
    getSubscription(self.id, user.id),
    getBan(self.id, user.id),
  ]);

  return {
    success: true,
    data: {
      stream,
      user,
      isSubscribed: !!subscription,
      isBanned: !!ban,
    },
  };
};
