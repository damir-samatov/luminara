"use server";
import { getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { ActionDataResponse } from "@/types/action.types";
import { User } from "@prisma/client";
import { searchUserByUsername } from "@/services/user.service";
import { getSubscriptionsByUserId } from "@/services/subscription.service";
import { SubscriptionWithUser } from "@/types/subscription.types";

type OnSearchUsersResponse = ActionDataResponse<{
  users: User[];
}>;

export const onSearchUsers = async (
  usernameSearch: string
): Promise<OnSearchUsersResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const users = await searchUserByUsername(self.id, usernameSearch);
    if (!users) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    return {
      success: true,
      data: {
        users,
      },
    };
  } catch (error) {
    console.error("getSubscriptions", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onGetSelfContextData = async (): Promise<
  ActionDataResponse<{
    subscriptions: SubscriptionWithUser[];
    self: User;
  }>
> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const subscriptions = await getSubscriptionsByUserId(self.id);
    return {
      success: true,
      data: {
        self,
        subscriptions,
      },
    };
  } catch (error) {
    console.error("onGetSelfContextData", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
