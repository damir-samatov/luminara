"use server";
import {
  ChatTokenCapability,
  CreateChatTokenCommand,
  CreateRoomCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-ivschat";
import { ivsChat } from "@/lib/ivs-chat";
import { IvsChatRoomToken } from "@/types/ivs.types";

export const createIvsChatRoom = async (userId: string) => {
  try {
    const command = new CreateRoomCommand({
      name: userId,
      tags: {
        userId,
      },
      maximumMessageLength: 100,
      maximumMessageRatePerSecond: 10,
    });

    const ivsCreateChatRoomRes = await ivsChat.send(command);

    if (!ivsCreateChatRoomRes || !ivsCreateChatRoomRes.arn) return null;

    return {
      chatRoomArn: ivsCreateChatRoomRes.arn,
    };
  } catch (error) {
    console.error("createIvsChatRoom", error);
    return null;
  }
};

type GetIvsChatTokenProps = {
  userId: string;
  chatRoomArn: string;
  capabilities: ChatTokenCapability[];
  imageUrl: string;
  username: string;
};

export const getIvsChatToken = async ({
  userId,
  chatRoomArn,
  capabilities,
  imageUrl,
  username,
}: GetIvsChatTokenProps): Promise<IvsChatRoomToken | null> => {
  try {
    const command = new CreateChatTokenCommand({
      userId,
      capabilities,
      attributes: {
        imageUrl,
        username,
      },
      roomIdentifier: chatRoomArn,
      sessionDurationInMinutes: 60,
    });

    const ivsGetChatRoomTokenRes = await ivsChat.send(command);
    if (
      !ivsGetChatRoomTokenRes ||
      !ivsGetChatRoomTokenRes.sessionExpirationTime ||
      !ivsGetChatRoomTokenRes.token ||
      !ivsGetChatRoomTokenRes.tokenExpirationTime
    )
      return null;

    return {
      token: ivsGetChatRoomTokenRes.token,
      sessionExpirationTime: ivsGetChatRoomTokenRes.sessionExpirationTime,
      tokenExpirationTime: ivsGetChatRoomTokenRes.tokenExpirationTime,
    };
  } catch (error) {
    console.error("getIvsChatToken", error);
    return null;
  }
};

type DeleteIvsChatMessageProps = {
  chatRoomArn: string;
  messageId: string;
  reason: string;
};

export const deleteIvsChatMessage = async ({
  chatRoomArn,
  messageId,
  reason,
}: DeleteIvsChatMessageProps) => {
  try {
    const command = new DeleteMessageCommand({
      roomIdentifier: chatRoomArn,
      id: messageId,
      reason,
    });

    const ivsDeleteChatMessageRes = await ivsChat.send(command);

    if (!ivsDeleteChatMessageRes?.id) return null;

    return {
      id: ivsDeleteChatMessageRes.id,
    };
  } catch (error) {
    console.error("deleteIvsChatMessage", error);
    return null;
  }
};
