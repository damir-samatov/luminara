"use server";
import { ActionDataResponse } from "@/types/action.types";
import { IvsChatRoomToken } from "@/types/ivs.types";
import { getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getStreamByUsername } from "@/services/stream.service";
import { getIvsViewerToken } from "@/services/ivs.service";
import { getIvsChatToken } from "@/services/ivs-chat.service";
import { getSignedFileReadUrl } from "@/services/s3.service";

type OnGetStreamViewerTokenResponse = ActionDataResponse<{
  title: string;
  playbackUrl: string;
  thumbnailUrl: string;
  description: string;
  streamerUsername: string;
  streamerImageUrl: string;
  chatRoomToken: IvsChatRoomToken;
  isChatEnabled: boolean;
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
      stream.isChatEnabled
        ? getIvsChatToken({
            userId: self.id,
            chatRoomArn: stream.chatRoomArn,
            imageUrl: self.imageUrl,
            username: self.username,
            capabilities: ["SEND_MESSAGE"],
          })
        : {
            token: "",
            sessionExpirationTime: new Date(),
            tokenExpirationTime: new Date(),
          },
      stream.thumbnailKey ? getSignedFileReadUrl(stream.thumbnailKey) : null,
    ]);

    if (!viewerToken || !chatRoomToken)
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        title: stream.title,
        description: stream.description,
        playbackUrl: `${stream.playbackUrl}?token=${viewerToken}`,
        thumbnailUrl: thumbnailUrl || stream.user.imageUrl,
        streamerImageUrl: stream.user.imageUrl,
        streamerUsername: stream.user.username,
        isChatEnabled: stream.isChatEnabled,
        chatRoomToken,
      },
    };
  } catch (error) {
    console.error("onGetStreamDataAsViewer", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
