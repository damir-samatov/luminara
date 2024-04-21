"use server";
import { db } from "@/lib/db";
import { ImagePostCreateDto } from "@/types/post.types";
import { Post, Image, Video } from "@prisma/client";

export const createImagePost = async (postCreateDto: ImagePostCreateDto) => {
  const { userId, title, body, images } = postCreateDto;

  const imagesCreate =
    images.length < 1 ? undefined : { createMany: { data: images } };

  try {
    return await db.post.create({
      data: {
        title,
        body,
        userId,
        images: imagesCreate,
      },
    });
  } catch (error) {
    console.error("createImagePost", error);
    return null;
  }
};

export const getImagePostsByUserId = async (
  userId: string
): Promise<
  (Post & {
    images: Image[];
  })[]
> => {
  try {
    return await db.post.findMany({
      where: {
        userId,
        videos: {
          none: {},
        },
      },
      include: {
        images: true,
      },
    });
  } catch (error) {
    console.error("getImagePostsByUserId", error);
    return [];
  }
};

export const getVideoPostsByUserId = async (
  userId: string
): Promise<
  (Post & {
    videos: Video[];
  })[]
> => {
  try {
    return await db.post.findMany({
      where: {
        userId,
        videos: {
          some: {},
        },
      },
      include: {
        videos: true,
      },
    });
  } catch (error) {
    console.error("getVideoPostsByUserId", error);
    return [];
  }
};

type CreateVideoPostProps = {
  userId: string;
  title: string;
  body: string;
  subscriptionPlanId: string | null;
  video: {
    title: string;
    key: string;
    thumbnailKey: string;
  };
};

export const createVideoPost = async ({
  userId,
  title,
  body,
  subscriptionPlanId,
  video,
}: CreateVideoPostProps) => {
  const videoCreate = { createMany: { data: [video] } };
  try {
    return await db.post.create({
      data: {
        userId,
        title,
        body,
        videos: videoCreate,
        subscriptionPlanId,
      },
    });
  } catch (error) {
    console.error("createVideoPost", error);
    return null;
  }
};
