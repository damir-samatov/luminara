"use server";
import { IngressInput } from "livekit-server-sdk";
import { getSelf } from "@/services/auth.service";
import { updateStreamByUserId } from "@/services/stream.service";
import {
  createIngress,
  resetIngressesByUserId,
} from "@/services/ingress.service";
import { ERROR_RESPONSES, SUCCESS_RESPONSES } from "@/configs/responses.config";
import { ActionCombinedResponse } from "@/types/action.types";

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
