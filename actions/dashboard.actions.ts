"use server";
import { Stream, User } from ".prisma/client";
import { getSelf } from "@/services/auth.service";
import { getStreamByUserId } from "@/services/stream.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { ActionDataResponse } from "@/types/action.types";

type GetDashboardDataResponse = ActionDataResponse<{
  self: User;
  stream: Stream;
}>;

export const getDashboardData = async (): Promise<GetDashboardDataResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const stream = await getStreamByUserId(self.id);
    if (!stream) return ERROR_RESPONSES.NOT_FOUND;

    return {
      success: true,
      data: {
        self,
        stream,
      },
    };
  } catch (error) {
    console.error("getDashboardData", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
