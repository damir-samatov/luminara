"use server";
import { AccessToken } from "livekit-server-sdk";

if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
  throw new Error(
    "Please add LIVEKIT_API_KEY and LIVEKIT_API_SECRET from LiveKit Dashboard to .env"
  );
}

export const generateLiveKitAccessToken = (
  userId: string,
  username: string,
  hostUserId: string,
  roomJoin: boolean = true,
  canPublish: boolean = false,
  canPublishData: boolean = true
) => {
  try {
    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: userId === hostUserId ? "host_" + userId : userId,
        name: username,
      }
    );

    token.addGrant({
      room: hostUserId,
      roomJoin,
      canPublish,
      canPublishData,
    });

    return token.toJwt();
  } catch (error) {
    console.error("generateLiveKitAccessToken", error);
    return null;
  }
};
