"use server";
import { db } from "@/lib/db";
import { PostCreateDto } from "@/types/post.types";

export const createPost = async (postCreateDto: PostCreateDto) => {
  const { userId, title, body, medias } = postCreateDto;

  try {
    return await db.post.create({
      data: {
        title,
        body,
        userId,
        medias: {
          createMany: {
            data: medias,
          },
        },
      },
    });
  } catch (error) {
    console.error("createPost", error);
    return null;
  }
};

export const getPostsByUserId = async (userId: string) => {
  try {
    return await db.post.findMany({
      where: {
        userId,
      },
      include: {
        medias: true,
      },
    });
  } catch (error) {
    console.error("getPostsByUserId", error);
    return [];
  }
};
