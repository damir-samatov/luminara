"use server";
import { db } from "@/lib/db";

type CreateCommentProps = {
  userId: string;
  postId: string;
  body: string;
};

export const createComment = async ({
  userId,
  postId,
  body,
}: CreateCommentProps) => {
  try {
    return await db.comment.create({
      data: {
        userId,
        postId,
        body,
      },
      select: {
        id: true,
        postId: true,
        body: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("createComment", error);
    return null;
  }
};

export const deleteComment = async (id: string) => {
  try {
    return await db.comment.delete({
      where: {
        id,
      },
      select: {
        id: true,
        postId: true,
        body: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("deleteComment", error);
    return null;
  }
};
