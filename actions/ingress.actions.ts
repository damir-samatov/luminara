"use server";
import {
  CreateIngressOptions,
  IngressAudioEncodingPreset,
  IngressClient,
  IngressInput,
  IngressVideoEncodingPreset,
  RoomServiceClient,
} from "livekit-server-sdk";
import { getSelf } from "@/services/auth.service";
import { TrackSource } from "livekit-server-sdk/dist/proto/livekit_models";
import { updateStreamByUserId } from "@/services/stream.service";
import { revalidatePath } from "next/cache";

//TODO: Refactor the heck out of it

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!);

export const resetIngresses = async (userId: string) => {
  const [ingresses, rooms] = await Promise.all([
    ingressClient.listIngress({
      roomName: userId,
    }),
    roomService.listRooms([userId]),
  ]);

  for (const room of rooms) {
    await roomService.deleteRoom(room.name);
  }

  for (const ingress of ingresses) {
    if (!ingress.ingressId) continue;
    await ingressClient.deleteIngress(ingress.ingressId);
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

  const ingress = await ingressClient.createIngress(
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
