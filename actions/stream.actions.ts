"use server";
import { getSelf } from "@/services/auth.service";
import {
  createStream,
  getStreamByUserId,
  getStreamByUsername,
  updateStreamKeyByUserId,
  updateStreamSettingsByUserId,
  updateStreamStatusByUserId,
  updateStreamThumbnailByUserId,
} from "@/services/stream.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { ActionDataResponse } from "@/types/action.types";
import { Stream } from ".prisma/client";
import { StreamSettingsUpdateDto } from "@/types/stream.types";
import { revalidatePath } from "next/cache";
import {
  createIvsChannel,
  getIvsViewerToken,
  refreshIvsChannelStreamKey,
} from "@/services/ivs.service";
import { deleteFile, getSignedFileReadUrl } from "@/services/s3.service";
import {
  createIvsChatRoom,
  getIvsChatToken,
} from "@/services/ivs-chat.service";
import { IvsChatRoomToken } from "@/types/ivs.types";

type OnGetSelfStreamResponse = ActionDataResponse<{ stream: Stream }>;

export const onGetSelfStream = async (): Promise<OnGetSelfStreamResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const stream = await getStreamByUserId(self.id);
    if (!stream) return ERROR_RESPONSES.NOT_FOUND;
    return {
      success: true,
      data: { stream },
    };
  } catch (error) {
    console.error("onGetSelfStream", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnUpdateSelfStreamThumbnailKeyResponse = ActionDataResponse<{
  stream: Stream;
}>;

export const onUpdateSelfStreamThumbnailKey = async (
  thumbnailKey: string
): Promise<OnUpdateSelfStreamThumbnailKeyResponse> => {
  try {
    const self = await getSelf();

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const existingStream = await getStreamByUserId(self.id);

    if (!existingStream) return ERROR_RESPONSES.NOT_FOUND;

    if (existingStream.thumbnailKey)
      await deleteFile(existingStream.thumbnailKey);

    const stream = await updateStreamThumbnailByUserId({
      userId: self.id,
      thumbnailKey,
    });

    if (!stream) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        stream,
      },
    };
  } catch (error) {
    console.error("onUpdateSelfStreamThumbnailKey", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnUpdateSelfStreamSettingsResponse = ActionDataResponse<{
  stream: Stream;
}>;

export const onUpdateSelfStreamSettings = async (
  updatedStreamSettings: StreamSettingsUpdateDto
): Promise<OnUpdateSelfStreamSettingsResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const newStream = await updateStreamSettingsByUserId(
      self.id,
      updatedStreamSettings
    );
    if (!newStream) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        stream: newStream,
      },
    };
  } catch (error) {
    console.error("onUpdateSelfStream", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnCreateSelfStreamResponse = ActionDataResponse<{
  stream: Stream;
}>;

export const onCreateSelfStream =
  async (): Promise<OnCreateSelfStreamResponse> => {
    try {
      const self = await getSelf();

      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

      const existingStream = await getStreamByUserId(self.id);

      if (existingStream) return ERROR_RESPONSES.STREAM_EXISTS;

      const [ivsChannel, ivsChatRoom] = await Promise.all([
        createIvsChannel({
          userId: self.id,
        }),
        createIvsChatRoom(self.id),
      ]);

      if (!ivsChannel || !ivsChatRoom)
        return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

      const stream = await createStream(self.id, {
        title: `Welcome to ${self.username}'s Stream`,
        channelArn: ivsChannel.channelArn,
        chatRoomArn: ivsChatRoom.chatRoomArn,
        serverUrl: ivsChannel.serverUrl,
        streamKey: ivsChannel.streamKey,
        streamKeyArn: ivsChannel.streamKeyArn,
        playbackUrl: ivsChannel.playbackUrl,
        thumbnailKey: "",
        isLive: false,
        isChatEnabled: false,
      });

      if (!stream) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

      revalidatePath("/dashboard/stream", "page");

      return {
        data: { stream },
        success: true,
      };
    } catch (error) {
      console.error("onGetSelfStream", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };

type OnRefreshSelfStreamKeyResponse = ActionDataResponse<{ streamKey: string }>;

export const onRefreshSelfStreamKey =
  async (): Promise<OnRefreshSelfStreamKeyResponse> => {
    try {
      const self = await getSelf();
      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

      const stream = await getStreamByUserId(self.id);

      if (!stream) return ERROR_RESPONSES.NOT_FOUND;

      const refreshedIvsChannelStreamKey = await refreshIvsChannelStreamKey({
        channelArn: stream.channelArn,
        streamKeyArn: stream.streamKeyArn,
      });

      if (!refreshedIvsChannelStreamKey)
        return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

      const updatedStream = await updateStreamKeyByUserId({
        userId: self.id,
        streamKey: refreshedIvsChannelStreamKey.streamKey,
        streamKeyArn: refreshedIvsChannelStreamKey.streamKeyArn,
      });

      if (!updatedStream) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

      return {
        success: true,
        data: { streamKey: refreshedIvsChannelStreamKey.streamKey },
      };
    } catch (error) {
      console.error("onGetSelfStream", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };

type OnGetStreamViewerTokenResponse = ActionDataResponse<{
  title: string;
  playbackUrl: string;
  thumbnailUrl: string;
  description: string;
  streamerUsername: string;
  streamerImageUrl: string;
  chatRoomToken: IvsChatRoomToken;
}>;

export const onGetStreamDataAsViewer = async (
  streamerUsername: string
): Promise<OnGetStreamViewerTokenResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const stream = await getStreamByUsername(streamerUsername);
    if (!stream || !stream.isLive) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const [viewerToken, chatRoomToken, thumbnailUrl] = await Promise.all([
      getIvsViewerToken(stream.channelArn),
      getIvsChatToken({
        userId: self.id,
        chatRoomArn: stream.chatRoomArn,
        imageUrl: self.imageUrl,
        username: self.username,
        capabilities: ["SEND_MESSAGE"],
      }),
      stream.thumbnailKey ? getSignedFileReadUrl(stream.thumbnailKey) : "",
    ]);

    if (!viewerToken || !chatRoomToken)
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        title: stream.title,
        description: "Welcome to the stream! Enjoy your stay!",
        playbackUrl: `${stream.playbackUrl}?token=${viewerToken}`,
        thumbnailUrl: thumbnailUrl || stream.user.imageUrl,
        streamerImageUrl: stream.user.imageUrl,
        streamerUsername: stream.user.username,
        chatRoomToken,
      },
    };
  } catch (error) {
    console.error("onGetStreamDataAsViewer", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGoLiveResponse = ActionDataResponse<{
  stream: Stream;
}>;

export const onGoLive = async (): Promise<OnGoLiveResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const stream = await updateStreamStatusByUserId(self.id, true);
    if (!stream) return ERROR_RESPONSES.NOT_FOUND;
    return {
      success: true,
      data: { stream },
    };
  } catch (error) {
    console.error("onGetSelfStream", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGoOfflineResponse = ActionDataResponse<{
  stream: Stream;
}>;

export const onGoOffline = async (): Promise<OnGoOfflineResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const stream = await updateStreamStatusByUserId(self.id, false);
    if (!stream) return ERROR_RESPONSES.NOT_FOUND;
    return {
      success: true,
      data: { stream },
    };
  } catch (error) {
    console.error("onGoOffline", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
