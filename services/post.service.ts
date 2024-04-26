"use server";
import { db } from "@/lib/db";

export const getPostById = async (id: string) => {
  try {
    return await db.post.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("getPostById", error);
    return null;
  }
};

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

export const deletePostById = async (id: string) => {
  try {
    return await db.post.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("deletePostById", error);
    return null;
  }
};

type UpdatePostSubscriptionPlanProps = {
  postId: string;
  subscriptionPlanId: string | null;
};

export const updatePostSubscriptionPlan = async ({
  postId,
  subscriptionPlanId,
}: UpdatePostSubscriptionPlanProps) => {
  try {
    return await db.post.update({
      where: {
        id: postId,
      },
      data: {
        subscriptionPlanId,
      },
    });
  } catch (error) {
    console.error("updatePostSubscriptionPlan", error);
    return null;
  }
};

type UpdatePostContentProps = {
  postId: string;
  title: string;
  body: string;
};

export const updatePostContent = async ({
  postId,
  title,
  body,
}: UpdatePostContentProps) => {
  try {
    return await db.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        body,
      },
    });
  } catch (error) {
    console.error("updatePostContent", error);
    return null;
  }
};
