"use server";
import { getSelf } from "@/services/auth.service";
import {
  createStream,
  getStreamByUserId,
  updateStreamKeyByUserId,
  updateStreamSettingsByUserId,
  updateStreamStatusByUserId,
  updateStreamThumbnailByUserId,
} from "@/services/stream.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { ActionDataResponse } from "@/types/action.types";
import { Stream, User } from "@prisma/client";
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
  deleteIvsChatMessage,
} from "@/services/ivs-chat.service";

type StreamActionsResponse = ActionDataResponse<{ stream: Stream }>;

export const onGetSelfStream = async (): Promise<StreamActionsResponse> => {
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

export const onUpdateSelfStreamThumbnailKey = async (
  thumbnailKey: string
): Promise<StreamActionsResponse> => {
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

export const onUpdateSelfStreamSettings = async (
  updatedStreamSettings: StreamSettingsUpdateDto
): Promise<StreamActionsResponse> => {
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

export const onCreateSelfStream = async (): Promise<StreamActionsResponse> => {
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
      description: "",
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

export const onRefreshSelfStreamKey =
  async (): Promise<StreamActionsResponse> => {
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
        data: { stream: updatedStream },
      };
    } catch (error) {
      console.error("onGetSelfStream", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };

export const onGoLive = async (): Promise<StreamActionsResponse> => {
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

export const onGoOffline = async (): Promise<StreamActionsResponse> => {
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

type OnGetStreamDataAsOwnerResponse = ActionDataResponse<{
  stream: Stream;
  user: User;
  playbackUrl: string;
  appliedThumbnailUrl: string;
}>;

export const onGetStreamDataAsOwner =
  async (): Promise<OnGetStreamDataAsOwnerResponse> => {
    try {
      const self = await getSelf();
      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

      const stream = await getStreamByUserId(self.id);

      if (!stream) return ERROR_RESPONSES.NOT_FOUND;

      const [viewerToken, thumbnailUrl] = await Promise.all([
        getIvsViewerToken(stream.channelArn),
        stream.thumbnailKey ? getSignedFileReadUrl(stream.thumbnailKey) : null,
      ]);

      if (!viewerToken) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

      return {
        success: true,
        data: {
          stream,
          user: self,
          playbackUrl: `${stream.playbackUrl}?token=${viewerToken}`,
          appliedThumbnailUrl: thumbnailUrl || self.imageUrl,
        },
      };
    } catch (error) {
      console.error("onGetStreamDataAsOwner", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };

export const onDeleteSelfChatMessage = async (messageId: string) => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const stream = await getStreamByUserId(self.id);
    if (!stream) return ERROR_RESPONSES.NOT_FOUND;

    const deleteIvsChatMessageRes = await deleteIvsChatMessage({
      messageId,
      chatRoomArn: stream.chatRoomArn,
      reason: "I don't like this message.",
    });

    if (!deleteIvsChatMessageRes) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        stream,
        user: self,
      },
    };
  } catch (error) {
    console.error("onDeleteSelfChatMessage", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
