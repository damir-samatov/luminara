"use server";
import { ActionDataResponse } from "@/types/action.types";
import { IvsChatRoomToken } from "@/types/ivs.types";
import { authSelf, getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getStreamByUsername } from "@/services/stream.service";
import { getIvsViewerToken } from "@/services/ivs.service";
import { getIvsChatToken } from "@/services/ivs-chat.service";
import { getSignedFileReadUrl } from "@/services/s3.service";
import { hasRequiredSubscriptionPlan } from "@/services/subscription-plan.service";

type OnGetChatRoomTokenResponse = ActionDataResponse<{
  chatRoomToken: IvsChatRoomToken;
}>;

export const onGetChatRoomToken = async (
  streamerUsername: string
): Promise<OnGetChatRoomTokenResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const stream = await getStreamByUsername(streamerUsername);
    if (!stream || (!stream.isLive && stream.userId !== self.id))
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const chatRoomToken = await getIvsChatToken({
      userId: self.id,
      chatRoomArn: stream.chatRoomArn,
      imageUrl: self.imageUrl,
      username: self.username,
      capabilities: ["SEND_MESSAGE"],
    });

    if (!chatRoomToken) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        chatRoomToken,
      },
    };
  } catch (error) {
    console.error("onGetChatRoomToken", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetStreamDataAsViewerResponse = ActionDataResponse<{
  title: string;
  playbackUrl: string;
  thumbnailUrl: string;
  description: string;
  streamerUsername: string;
  streamerImageUrl: string;
  isChatEnabled: boolean;
  isLive: boolean;
  hasAccess: boolean;
}>;

export const onGetStreamWatchData = async (
  streamerUsername: string
): Promise<OnGetStreamDataAsViewerResponse> => {
  try {
    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const stream = await getStreamByUsername(streamerUsername);
    if (!stream) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const data = {
      isLive: true,
      hasAccess: true,
      playbackUrl: "",
      thumbnailUrl: "",
      title: stream.title,
      description: stream.description,
      streamerImageUrl: stream.user.imageUrl,
      streamerUsername: stream.user.username,
      isChatEnabled: stream.isChatEnabled,
    };

    if (!stream.isLive) {
      data.isLive = false;
      return {
        success: true,
        data,
      };
    }

    const hasAccess = await hasRequiredSubscriptionPlan({
      userId: self.id,
      requiredSubscriptionPlanId: stream.subscriptionPlanId,
    });

    if (!hasAccess) {
      data.hasAccess = false;
      return {
        success: true,
        data,
      };
    }

    const [viewerToken, thumbnailUrl] = await Promise.all([
      getIvsViewerToken(stream.channelArn),
      getSignedFileReadUrl(stream.thumbnailKey),
    ]);

    if (!viewerToken) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    data.playbackUrl = `${stream.playbackUrl}?token=${viewerToken}`;
    data.thumbnailUrl = thumbnailUrl;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("onGetStreamWatchData", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetStreamDataAsModeratorResponse = ActionDataResponse<{
  title: string;
  playbackUrl: string;
  thumbnailUrl: string;
  description: string;
  streamerUsername: string;
  streamerImageUrl: string;
  isChatEnabled: boolean;
}>;

export const onGetStreamModerationData = async (
  streamerUsername: string
): Promise<OnGetStreamDataAsModeratorResponse> => {
  try {
    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const stream = await getStreamByUsername(streamerUsername);

    if (!stream || !stream.isLive) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    if (self.id !== stream.userId) return ERROR_RESPONSES.UNAUTHORIZED;

    const [viewerToken, thumbnailUrl] = await Promise.all([
      getIvsViewerToken(stream.channelArn),
      getSignedFileReadUrl(stream.thumbnailKey),
    ]);

    if (!viewerToken) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        title: stream.title,
        description: stream.description,
        playbackUrl: `${stream.playbackUrl}?token=${viewerToken}`,
        thumbnailUrl: thumbnailUrl,
        streamerImageUrl: stream.user.imageUrl,
        streamerUsername: stream.user.username,
        isChatEnabled: stream.isChatEnabled,
      },
    };
  } catch (error) {
    console.error("onGetStreamModerationData", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
