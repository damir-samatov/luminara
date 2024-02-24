"use server";
import { getSelf } from "@/services/auth.service";
import {
  getStreamByUserId,
  getStreamByUsername,
  updateStreamByUserId,
} from "@/services/stream.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { ActionDataResponse } from "@/types/action.types";
import { Stream } from ".prisma/client";
import { StreamSettingsUpdateDto, StreamUpdateDto } from "@/types/stream.types";
import { mapStreamToUpdateStreamSettingsDto } from "@/helpers/stream.helpers";
import { revalidatePath } from "next/cache";

type onGetSelfStreamResponse = ActionDataResponse<{ stream: Stream }>;

export const onGetSelfStream = async (): Promise<onGetSelfStreamResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const stream = await getStreamByUserId(self.id);
    if (!stream) return ERROR_RESPONSES.NOT_FOUND;
    return {
      success: true,
      data: { stream },
    };
  } catch (error) {
    console.error("onGetSelfStream", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetStreamByUsernameResponse = ActionDataResponse<{ stream: Stream }>;

export const onGetStreamByUsername = async (
  username: string
): Promise<OnGetStreamByUsernameResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const stream = await getStreamByUsername(username);
    if (!stream) return ERROR_RESPONSES.NOT_FOUND;
    return {
      success: true,
      data: { stream },
    };
  } catch (error) {
    console.error("onGetSelfStream", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnUpdateSelfStreamSettingsResponse = ActionDataResponse<{
  newStreamSettings: StreamSettingsUpdateDto;
}>;

export const onUpdateSelfStreamSettings = async (
  updatedStreamSettings: StreamUpdateDto
): Promise<OnUpdateSelfStreamSettingsResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const newStream = await updateStreamByUserId(
      self.id,
      updatedStreamSettings
    );
    if (!newStream) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/dashboard/stream", "page");
    return {
      success: true,
      data: {
        newStreamSettings: mapStreamToUpdateStreamSettingsDto(newStream),
      },
    };
  } catch (error) {
    console.error("onUpdateSelfStream", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
