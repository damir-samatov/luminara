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

export const getBlogPostById = async (id: string) => {
  try {
    return await db.post.findUnique({
      where: {
        id,
        videos: {
          none: {},
        },
      },
      include: {
        images: true,
        subscriptionPlan: true,
      },
    });
  } catch (error) {
    console.error("getBlogPostById", error);
    return null;
  }
};

export const deleteBlogPostById = async (id: string) => {
  try {
    return await db.post.delete({
      where: {
        id,
        videos: {
          none: {},
        },
      },
    });
  } catch (error) {
    console.error("deleteBlogPostById", error);
    return null;
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

export const getVideoPostById = async (id: string) => {
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
    console.error("getVideoPostById", error);
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
