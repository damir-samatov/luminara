"use server";
import { getSelf } from "@/services/auth.service";
import { getUserById } from "@/services/user.service";
import { generateViewerToken } from "@/services/livekit.service";
import { ActionDataResponse } from "@/types/action.types";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getBan } from "@/services/ban.service";

type GetViewerTokenResponse = ActionDataResponse<{
  token: string;
}>;

export const onGetViewerToken = async (
  hostUserId: string
): Promise<GetViewerTokenResponse> => {
  try {
    const self = await getSelf();

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const hostUser = await getUserById(hostUserId);

    if (!hostUser) return ERROR_RESPONSES.NOT_FOUND;

    const ban = await getBan(hostUser.id, self.id);

    if (ban) return ERROR_RESPONSES.UNAUTHORIZED;

    const token = generateViewerToken(self.id, self.username, hostUser.id);

    if (!token) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        token,
      },
    };
  } catch (error) {
    console.error("onGetViewerToken", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
