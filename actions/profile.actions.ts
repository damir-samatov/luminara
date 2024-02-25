"use server";
import { getUserByUsername } from "@/services/user.service";
import { getSelf } from "@/services/auth.service";
import { getSubscription } from "@/services/subscription.service";
import { getBan } from "@/services/ban.service";
import { User } from ".prisma/client";
import { ActionDataResponse } from "@/types/action.types";
import { ERROR_RESPONSES } from "@/configs/responses.config";

type GetProfileDataResponse = ActionDataResponse<{
  user: User;
  isSubscribed: boolean;
  isBanned: boolean;
}>;

export const getProfileData = async (
  username: string
): Promise<GetProfileDataResponse> => {
  try {
    const [self, user] = await Promise.all([
      getSelf(),
      getUserByUsername(username),
    ]);
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (!user) return ERROR_RESPONSES.NOT_FOUND;
    const selfBan = await getBan(user.id, self.id);
    if (selfBan) return ERROR_RESPONSES.NOT_FOUND;
    const subscription = await getSubscription(self.id, user.id);
    return {
      success: true,
      data: {
        user,
        isSubscribed: !!subscription,
        isBanned: !!selfBan,
      },
    };
  } catch (error) {
    console.error("getProfileData", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
