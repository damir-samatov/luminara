"use server";
import {
  ChatTokenCapability,
  CreateChatTokenCommand,
  CreateRoomCommand,
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

    console.dir(
      {
        ivsCreateChatRoomRes,
      },
      { depth: 20 }
    );

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
    const input = {
      userId,
      capabilities,
      attributes: {
        imageUrl,
        username,
      },
      roomIdentifier: chatRoomArn,
      sessionDurationInMinutes: 60,
    };
    const command = new CreateChatTokenCommand(input);

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
