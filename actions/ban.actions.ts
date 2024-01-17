"use server";
import { getSelf } from "@/services/auth.service";
import { createBan, deleteBan } from "@/services/ban.service";
import { ERROR_RESPONSES, SUCCESS_RESPONSES } from "@/configs/responses.config";
import { ActionCombinedResponse } from "@/types/action.types";

export const onBan = async (
  userId: string
): Promise<ActionCombinedResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (self.id === userId) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    await createBan(self.id, userId);
    return SUCCESS_RESPONSES.SUCCESS;
  } catch (error) {
    console.error("onBan", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onUnban = async (
  userId: string
): Promise<ActionCombinedResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (self.id === userId) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    await deleteBan(self.id, userId);
    return SUCCESS_RESPONSES.SUCCESS;
  } catch (error) {
    console.error("onUnban", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
