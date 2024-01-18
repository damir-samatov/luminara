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

export type StreamSettingsUpdateDto = Pick<
  Stream,
  | "title"
  | "imageUrl"
  | "isLive"
  | "chatDelay"
  | "isChatEnabled"
  | "isChatForSubscribersOnly"
>;

export type StreamCredentialsUpdateDto = Pick<
  Stream,
  "serverUrl" | "streamKey" | "ingressId"
>;
