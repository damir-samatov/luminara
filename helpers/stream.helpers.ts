import { Stream } from ".prisma/client";
import { StreamUpdateDto } from "@/types/stream.types";

export const mapStreamToUpdateDto = (stream: Stream): StreamUpdateDto => {
  return {
    title: stream.title,
    isChatEnabled: stream.isChatEnabled,
    isChatForSubscribersOnly: stream.isChatForSubscribersOnly,
    chatDelay: stream.chatDelay,
    imageUrl: stream.imageUrl,
    isLive: stream.isLive,
    ingressId: stream.ingressId,
    streamKey: stream.streamKey,
    serverUrl: stream.serverUrl,
  };
};
