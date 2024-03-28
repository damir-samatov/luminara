"use server";
import { getSelf } from "@/services/auth.service";
import { getRecommendationsByUserId } from "@/services/recommendation.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { ActionDataResponse } from "@/types/action.types";
import { User } from "@prisma/client";

type OnGetRecommendationsResponse = ActionDataResponse<{
  recommendations: User[];
}>;

export const onGetRecommendations =
  async (): Promise<OnGetRecommendationsResponse> => {
    try {
      const self = await getSelf();

      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

      const recommendations = await getRecommendationsByUserId(self.id);

      if (!recommendations) return ERROR_RESPONSES.NOT_FOUND;

      return {
        success: true,
        data: {
          recommendations,
        },
      };
    } catch (error) {
      console.error("getRecommendations", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };
