import { Stream } from ".prisma/client";
import {
  StreamKeysUpdateDto,
  StreamSettingsUpdateDto,
} from "@/types/stream.types";

export const mapStreamToUpdateStreamSettingsDto = (
  stream: Stream
): StreamSettingsUpdateDto => {
  return {
    title: stream.title,
    isChatEnabled: stream.isChatEnabled,
    isChatForSubscribersOnly: stream.isChatForSubscribersOnly,
    chatDelay: stream.chatDelay,
    imageUrl: stream.imageUrl,
    isLive: stream.isLive,
  };
};

export const mapStreamToUpdateStreamCredentialsDto = (
  stream: Stream
): StreamKeysUpdateDto => {
  return {
    serverUrl: stream.serverUrl,
    streamKey: stream.streamKey,
    ingressId: stream.ingressId,
  };
};
