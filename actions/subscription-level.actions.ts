"use server";
import { ActionDataResponse } from "@/types/action.types";
import { SubscriptionLevel } from "@prisma/client";
import { getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import {
  createSubscriptionLevel,
  getSubscriptionLevels,
} from "@/services/subscription-levels.service";
import { SubscriptionLevelCreateDto } from "@/types/subscription-levels.types";

type OnGetSelfSubscriptionLevelsResponse = ActionDataResponse<{
  subscriptionLevels: SubscriptionLevel[];
}>;

export const onGetSelfSubscriptionLevels =
  async (): Promise<OnGetSelfSubscriptionLevelsResponse> => {
    try {
      const self = await getSelf();
      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
      const subscriptionLevels = await getSubscriptionLevels(self.id);
      if (!subscriptionLevels) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
      return {
        success: true,
        data: {
          subscriptionLevels,
        },
      };
    } catch (error) {
      console.error("onGetSelfSubscriptionLevels", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };

type OnCreateSubscriptionLevelResponse = ActionDataResponse<{
  subscriptionLevel: SubscriptionLevel;
}>;

export const onCreateSubscriptionLevel = async (
  subscriptionLevelCreateDto: SubscriptionLevelCreateDto
): Promise<OnCreateSubscriptionLevelResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const subscriptionLevel = await createSubscriptionLevel({
      subscriptionLevelCreateDto,
      userId: self.id,
    });
    if (!subscriptionLevel) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    return {
      success: true,
      data: {
        subscriptionLevel,
      },
    };
  } catch (error) {
    console.error("onCreateSubscriptionLevel", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
