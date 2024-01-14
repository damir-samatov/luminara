import { Stream } from ".prisma/client";

export type StreamUpdateDto = Partial<
  Pick<
    Stream,
    | "title"
    | "serverUrl"
    | "streamKey"
    | "ingressId"
    | "imageUrl"
    | "isLive"
    | "chatDelay"
    | "isChatEnabled"
    | "isChatForSubscribersOnly"
  >
>;
