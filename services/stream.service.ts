"use server";
import { db } from "@/lib/db";
import { StreamCreateDto, StreamSettingsUpdateDto } from "@/types/stream.types";

export const createStream = (
  userId: string,
  streamCreateDto: StreamCreateDto
) => {
  try {
    return db.stream.create({
      data: { ...streamCreateDto, userId },
    });
  } catch (error) {
    console.error("createStream", error);
    return null;
  }
};

export const getStreamByUserId = async (userId: string) => {
  try {
    return await db.stream.findUnique({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.error("getStreamByUserId", error);
    return null;
  }
};

export const getStreamByUsername = async (username: string) => {
  try {
    return await db.stream.findFirst({
      where: {
        user: {
          username,
        },
      },
      include: {
        user: true,
        subscriptionPlan: true,
      },
    });
  } catch (error) {
    console.error("getStreamByUserId", error);
    return null;
  }
};

export const updateStreamSettingsByUserId = (
  userId: string,
  streamUpdateDto: StreamSettingsUpdateDto
) => {
  try {
    return db.stream.update({
      where: {
        userId,
      },
      data: { ...streamUpdateDto },
    });
  } catch (error) {
    console.error("updateStreamSettingsByUserId", error);
    return null;
  }
};

type UpdateStreamKeyByUserIdProps = {
  userId: string;
  streamKey: string;
  streamKeyArn: string;
};

export const updateStreamKeyByUserId = ({
  userId,
  streamKey,
  streamKeyArn,
}: UpdateStreamKeyByUserIdProps) => {
  try {
    return db.stream.update({
      where: {
        userId,
      },
      data: { streamKey, streamKeyArn },
    });
  } catch (error) {
    console.error("updateStreamKeyByUserId", error);
    return null;
  }
};

export const updateStreamStatusByUserId = (userId: string, isLive: boolean) => {
  try {
    return db.stream.update({
      where: {
        userId,
      },
      data: { isLive },
    });
  } catch (error) {
    console.error("updateStreamStatusByUserId", error);
    return null;
  }
};

export const updateStreamSubscriptionPlanByUserId = (
  userId: string,
  subscriptionPlanId: string | null
) => {
  try {
    return db.stream.update({
      where: {
        userId,
      },
      data: { subscriptionPlanId },
    });
  } catch (error) {
    console.error("updateStreamSubscriptionPlanByUserId", error);
    return null;
  }
};
