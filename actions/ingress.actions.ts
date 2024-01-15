"use server";
import {
  CreateIngressOptions,
  IngressAudioEncodingPreset,
  IngressInput,
  IngressVideoEncodingPreset,
} from "livekit-server-sdk";
import { getSelf } from "@/services/auth.service";
import { TrackSource } from "livekit-server-sdk/dist/proto/livekit_models";
import { updateStreamByUserId } from "@/services/stream.service";
import { revalidatePath } from "next/cache";
import { liveKitIngressClient } from "@/lib/liveKitIngressClient";
import { liveKitRoomService } from "@/lib/liveKitRoomService";

//TODO: Refactor the heck out of it

export const resetIngresses = async (userId: string) => {
  const [ingresses, rooms] = await Promise.all([
    liveKitIngressClient.listIngress({
      roomName: userId,
    }),
    liveKitRoomService.listRooms([userId]),
  ]);

  for (const room of rooms) {
    await liveKitRoomService.deleteRoom(room.name);
  }

  for (const ingress of ingresses) {
    if (!ingress.ingressId) continue;
    await liveKitIngressClient.deleteIngress(ingress.ingressId);
  }
};

export const createIngress = async (ingressType: IngressInput) => {
  const self = await getSelf();

  if (!self) throw new Error("Ingress user not found");

  await resetIngresses(self.id);

  const ingressOptions: CreateIngressOptions = {
    name: self.username,
    roomName: self.id,
    participantName: self.username,
    participantIdentity: self.id,
  };

  if (ingressType === IngressInput.WHIP_INPUT) {
    ingressOptions.bypassTranscoding = true;
  } else {
    ingressOptions.video = {
      source: TrackSource.CAMERA,
      preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
    };
    ingressOptions.audio = {
      source: TrackSource.MICROPHONE,
      preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
    };
  }

  const ingress = await liveKitIngressClient.createIngress(
    ingressType,
    ingressOptions
  );

  if (!ingress || !ingress.url || !ingress.streamKey) {
    throw new Error("Failed to create ingress");
  }

  await updateStreamByUserId(self.id, {
    ingressId: ingress.ingressId,
    serverUrl: ingress.url,
    streamKey: ingress.streamKey,
  });

  revalidatePath(`/`);
};
