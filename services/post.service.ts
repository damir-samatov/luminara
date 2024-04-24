"use server";
import { db } from "@/lib/db";

type CreateBlogPostProps = {
  userId: string;
  title: string;
  body: string;
  subscriptionPlanId: string | null;
  image: {
    title: string;
    key: string;
  };
};

export const createBlogPost = async ({
  userId,
  title,
  image,
  body,
  subscriptionPlanId,
}: CreateBlogPostProps) => {
  const imageCreate = { createMany: { data: [image] } };
  try {
    return await db.post.create({
      data: {
        userId,
        title,
        body,
        images: imageCreate,
        subscriptionPlanId,
      },
    });
  } catch (error) {
    console.error("createBlogPost", error);
    return null;
  }
};

export const getBlogPostsByUserId = async (userId: string) => {
  try {
    return await db.post.findMany({
      where: {
        userId,
        videos: {
          none: {},
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
        subscriptionPlan: true,
      },
    });
  } catch (error) {
    console.error("getBlogPostsByUserId", error);
    return [];
  }
};

export const getVideoPostsByUserId = async (userId: string) => {
  try {
    return await db.post.findMany({
      where: {
        userId,
        videos: {
          some: {},
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        videos: true,
        subscriptionPlan: true,
      },
    });
  } catch (error) {
    console.error("getVideoPostsByUserId", error);
    return [];
  }
};

export const getVideoPostsById = async (id: string) => {
  try {
    return await db.post.findUnique({
      where: {
        id,
        videos: {
          some: {},
        },
      },
      include: {
        videos: true,
        subscriptionPlan: true,
      },
    });
  } catch (error) {
    console.error("getVideoPostsById", error);
    return null;
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

export const deleteVideoPostById = async (id: string) => {
  try {
    return await db.post.delete({
      where: {
        id,
        videos: {
          some: {},
        },
      },
    });
  } catch (error) {
    console.error("deleteVideoPostById", error);
    return null;
  }
};
