"use server";
import { getSelf } from "@/services/auth.service";
import { getRecommendedUsersByUserId } from "@/services/recommendation.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { ActionDataResponse } from "@/types/action.types";
import { UserDto } from "@/types/user.types";

type OnGetRecommendationsResponse = ActionDataResponse<{
  users: UserDto[];
}>;

export const onGetRecommendedUsers =
  async (): Promise<OnGetRecommendationsResponse> => {
    try {
      const self = await getSelf();

      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

      const users = await getRecommendedUsersByUserId(self.id);

      if (!users) return ERROR_RESPONSES.NOT_FOUND;

      return {
        success: true,
        data: {
          users,
        },
      };
    } catch (error) {
      console.error("getRecommendations", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };
