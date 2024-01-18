"use server";
import { IngressInput } from "livekit-server-sdk";
import { getSelf } from "@/services/auth.service";
import {
  getStreamByUserId,
  updateStreamByUserId,
} from "@/services/stream.service";
import {
  createIngress,
  resetIngressesByUserId,
} from "@/services/ingress.service";
import { ERROR_RESPONSES, SUCCESS_RESPONSES } from "@/configs/responses.config";
import {
  ActionCombinedResponse,
  ActionDataResponse,
} from "@/types/action.types";
import { Stream } from ".prisma/client";
import { StreamUpdateDto } from "@/types/stream.types";

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

type onUpdateSelfStreamResponse = ActionDataResponse<{
  newStream: Stream;
}>;

export const onUpdateSelfStream = async (
  updatedStream: StreamUpdateDto
): Promise<onUpdateSelfStreamResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const newStream = await updateStreamByUserId(self.id, updatedStream);
    if (!newStream) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    return {
      success: true,
      data: { newStream },
    };
  } catch (error) {
    console.error("onUpdateSelfStream", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onGenerateStreamCredentials = async (
  ingressType: IngressInput
): Promise<ActionCombinedResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    await resetIngressesByUserId(self.id);
    const { ingressId, serverUrl, streamKey } = await createIngress(
      self,
      ingressType
    );
    await updateStreamByUserId(self.id, {
      ingressId,
      serverUrl,
      streamKey,
    });
    return SUCCESS_RESPONSES.SUCCESS;
  } catch (error) {
    console.error("onGenerateStreamCredentials", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
