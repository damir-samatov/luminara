"use server";
import { db } from "@/lib/db";
import { ImagePostCreateDto, VideoPostCreateDto } from "@/types/post.types";
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
        images: {
          some: {},
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

export const createVideoPost = async (postCreateDto: VideoPostCreateDto) => {
  const { userId, title, body, videos } = postCreateDto;

  const videoCreate =
    videos.length < 1 ? undefined : { createMany: { data: videos } };

  try {
    return await db.post.create({
      data: {
        userId,
        title,
        body,
        videos: videoCreate,
      },
    });
  } catch (error) {
    console.error("createVideoPost", error);
    return null;
  }
};
