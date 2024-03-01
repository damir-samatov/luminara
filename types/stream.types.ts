export type StreamCreateDto = {
  title: string;
  isLive: boolean;
  isChatEnabled: boolean;

  serverUrl: string;
  streamKey: string;
  streamKeyArn: string;
  channelArn: string;
  playbackUrl: string;

  thumbnailKey: string;
};

export type StreamSettingsUpdateDto = {
  title: string;
  isLive: boolean;
  isChatEnabled: boolean;
};

export type StreamCredentialsUpdateDto = {
  serverUrl: string;
  streamKey: string;
};
