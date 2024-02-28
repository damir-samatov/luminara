"use server";
import { db } from "@/lib/db";
import { PostCreateDto } from "@/types/post.types";
import { Post, Image } from ".prisma/client";

export const createPost = async (postCreateDto: PostCreateDto) => {
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
    console.error("createPost", error);
    return null;
  }
};

export const getPostsByUserId = async (
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
      },
      include: {
        images: true,
      },
    });
  } catch (error) {
    console.error("getPostsByUserId", error);
    return [];
  }
};
