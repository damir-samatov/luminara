"use client";
import { onGetChatRoomToken } from "@/actions/stream-viewer.actions";

export const chatRoomTokenProvider = async (streamerUsername: string) => {
  const res = await onGetChatRoomToken(streamerUsername);
  if (res.success) return res.data.chatRoomToken;
  return {
    token: "",
    sessionExpirationTime: new Date(),
    tokenExpirationTime: new Date(),
  };
};
