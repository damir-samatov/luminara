export type StreamCreateDto = {
  title: string;
  description: string;
  isLive: boolean;
  isChatEnabled: boolean;

  serverUrl: string;
  streamKey: string;
  streamKeyArn: string;
  channelArn: string;
  chatRoomArn: string;
  playbackUrl: string;

  thumbnailKey: string;
};

export type StreamSettingsUpdateDto = {
  title: string;
  description: string;
  isChatEnabled: boolean;
};

export enum StreamUserRoles {
  MODERATOR = "MODERATOR",
  STREAMER = "STREAMER",
  VIEWER = "VIEWER",
}

export enum StreamEvents {
  STREAM_ENDED = "STREAM_ENDED",
  USER_BANNED = "USER_BANNED",
}
