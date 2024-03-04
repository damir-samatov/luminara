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

export type StreamCredentialsUpdateDto = {
  serverUrl: string;
  streamKey: string;
};
