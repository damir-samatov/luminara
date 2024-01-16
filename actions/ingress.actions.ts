"use server";
import { IngressInput } from "livekit-server-sdk";
import { getSelf } from "@/services/auth.service";
import { updateStreamByUserId } from "@/services/stream.service";
import { revalidatePath } from "next/cache";
import {
  createIngress,
  resetIngressesByUserId,
} from "@/services/ingress.service";

export const onGenerateStreamCredentials = async (
  ingressType: IngressInput
) => {
  const self = await getSelf();

  if (!self) throw new Error("Unauthorized");

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

  revalidatePath(`/`);
};
