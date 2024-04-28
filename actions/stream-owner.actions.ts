"use server";
import { authSelf, getSelf } from "@/services/auth.service";
import {
  createStream,
  getStreamByUserId,
  updateStreamKeyByUserId,
  updateStreamSettingsByUserId,
  updateStreamStatusByUserId,
  updateStreamSubscriptionPlanByUserId,
} from "@/services/stream.service";
import { ERROR_RESPONSES, SUCCESS_RESPONSES } from "@/configs/responses.config";
import {
  ActionCombinedResponse,
  ActionDataResponse,
} from "@/types/action.types";
import { Stream, User } from "@prisma/client";
import { StreamEvents, StreamSettingsUpdateDto } from "@/types/stream.types";
import {
  createIvsChannel,
  getIvsViewerToken,
  refreshIvsChannelStreamKey,
} from "@/services/ivs.service";
import {
  getSignedFileReadUrl,
  getSignedFileUploadUrl,
} from "@/services/s3.service";
import {
  createIvsChatRoom,
  deleteIvsChatMessage,
  sendIvsChatEvent,
} from "@/services/ivs-chat.service";
import {
  getSubscriptionPlanById,
  getSubscriptionPlansByUserId,
} from "@/services/subscription-plan.service";
import { generateFileKey } from "@/helpers/server/s3.helpers";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import {
  ELIGIBLE_IMAGE_TYPES,
  STREAM_THUMBNAIL_IMAGE_MAX_SIZE,
} from "@/configs/file.config";

type StreamActionsResponse = ActionDataResponse<{ stream: Stream }>;

type OnGetStreamDashboardDataResponse = ActionDataResponse<{
  thumbnailUrl: string;
  playbackUrl: string;
  user: User;
  stream: Stream;
  subscriptionPlans: SubscriptionPlanDto[];
}>;

export const onGetStreamDashboardData =
  async (): Promise<OnGetStreamDashboardDataResponse> => {
    try {
      const self = await getSelf();
      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
      const [stream, subscriptionPlans] = await Promise.all([
        getStreamByUserId(self.id),
        getSubscriptionPlansByUserId(self.id),
      ]);
      if (!stream) return ERROR_RESPONSES.NOT_FOUND;
      if (!subscriptionPlans) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

      const [viewerToken, thumbnailUrl] = await Promise.all([
        getIvsViewerToken(stream.channelArn),
        getSignedFileReadUrl(stream.thumbnailKey),
      ]);

      const subscriptionPlansWithImageUrls = await Promise.all(
        subscriptionPlans.map(async (subscriptionPlan) => {
          const imageUrl = await getSignedFileReadUrl(
            subscriptionPlan.imageKey
          );
          return {
            ...subscriptionPlan,
            imageUrl,
          };
        })
      );

      if (!viewerToken || !thumbnailUrl)
        return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

      return {
        success: true,
        data: {
          user: self,
          subscriptionPlans: subscriptionPlansWithImageUrls,
          stream,
          thumbnailUrl,
          playbackUrl: `${stream.playbackUrl}?token=${viewerToken}`,
        },
      };
    } catch (error) {
      console.error("onGetStreamDashboardData", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };

export const onUpdateStreamSubscriptionPlan = async (
  subscriptionPlanId: string | null
): Promise<ActionCombinedResponse> => {
  try {
    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    if (subscriptionPlanId !== null) {
      const subscriptionPlan =
        await getSubscriptionPlanById(subscriptionPlanId);
      if (!subscriptionPlan) return ERROR_RESPONSES.NOT_FOUND;
      if (subscriptionPlan.userId !== self.id)
        return ERROR_RESPONSES.UNAUTHORIZED;
    }

    const updatedStream = await updateStreamSubscriptionPlanByUserId(
      self.id,
      subscriptionPlanId
    );

    if (!updatedStream) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      message: "Subscription plan updated successfully.",
    };
  } catch (error) {
    console.error("onUpdateStreamSubscriptionPlan", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onUpdateStreamSettings = async (
  updatedStreamSettings: StreamSettingsUpdateDto
): Promise<StreamActionsResponse> => {
  try {
    const self = await authSelf();
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
    console.error("onUpdateStreamSettings", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onCreateStream = async () => {
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
      title: `Welcome to ${self.username}'s`,
      description: "<p></p>",
      channelArn: ivsChannel.channelArn,
      chatRoomArn: ivsChatRoom.chatRoomArn,
      serverUrl: ivsChannel.serverUrl,
      streamKey: ivsChannel.streamKey,
      streamKeyArn: ivsChannel.streamKeyArn,
      playbackUrl: ivsChannel.playbackUrl,
      thumbnailKey: generateFileKey(self.id),
      isLive: false,
      isChatEnabled: true,
    });

    if (!stream) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return SUCCESS_RESPONSES.SUCCESS;
  } catch (error) {
    console.error("onCreateStream", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type GetSignedFileUploadUrlParams = {
  type: string;
  size: number;
};

type OnGetStreamThumbnailUploadUrlResponse = ActionDataResponse<{
  thumbnailUploadUrl: string;
}>;

export const onGetStreamThumbnailUploadUrl = async ({
  type,
  size,
}: GetSignedFileUploadUrlParams): Promise<OnGetStreamThumbnailUploadUrlResponse> => {
  try {
    if (
      size > STREAM_THUMBNAIL_IMAGE_MAX_SIZE ||
      !ELIGIBLE_IMAGE_TYPES.includes(type)
    )
      return ERROR_RESPONSES.BAD_REQUEST;

    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const stream = await getStreamByUserId(self.id);
    if (!stream) return ERROR_RESPONSES.NOT_FOUND;

    const thumbnailUploadUrl = await getSignedFileUploadUrl({
      key: stream.thumbnailKey,
      size,
      type,
    });

    if (!thumbnailUploadUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        thumbnailUploadUrl,
      },
    };
  } catch (error) {
    console.error("onGetStreamThumbnailUploadUrl", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnRefreshSelfStreamKey = ActionDataResponse<{
  streamKey: string;
}>;

export const onRefreshStreamKey = async (): Promise<OnRefreshSelfStreamKey> => {
  try {
    const self = await authSelf();
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
      data: { streamKey: updatedStream.streamKey },
    };
  } catch (error) {
    console.error("onRefreshStreamKey", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onGoLive = async (): Promise<StreamActionsResponse> => {
  try {
    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const stream = await updateStreamStatusByUserId(self.id, true);
    if (!stream) return ERROR_RESPONSES.NOT_FOUND;
    return {
      success: true,
      data: { stream },
    };
  } catch (error) {
    console.error("onGoLive", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onGoOffline = async (): Promise<StreamActionsResponse> => {
  try {
    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const stream = await updateStreamStatusByUserId(self.id, false);
    if (!stream) return ERROR_RESPONSES.NOT_FOUND;

    await sendIvsChatEvent({
      chatRoomArn: stream.chatRoomArn,
      eventName: StreamEvents.STREAM_ENDED,
    });

    return {
      success: true,
      data: { stream },
    };
  } catch (error) {
    console.error("onGoOffline", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onDeleteChatMessage = async (messageId: string) => {
  try {
    const self = await authSelf();
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
    console.error("onDeleteChatMessage", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
