"use server";
import { liveKitIngressClient } from "@/lib/liveKitIngressClient";
import { liveKitRoomService } from "@/lib/liveKitRoomService";
import {
  CreateIngressOptions,
  IngressAudioEncodingPreset,
  IngressInput,
  IngressVideoEncodingPreset,
} from "livekit-server-sdk";
import { TrackSource } from "livekit-server-sdk/dist/proto/livekit_models";
import { User } from ".prisma/client";

export const resetIngressesByUserId = async (userId: string) => {
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

export const createIngress = async (user: User, ingressType: IngressInput) => {
  const ingressOptions: CreateIngressOptions = {
    name: user.username,
    roomName: user.id,
    participantName: user.username,
    participantIdentity: user.id,
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

  return {
    ingressId: ingress.ingressId,
    serverUrl: ingress.url,
    streamKey: ingress.streamKey,
  };
};
