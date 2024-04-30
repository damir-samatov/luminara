import { db } from "@/lib/db";

type CreateProfileProps = {
  userId: string;
  coverImageKey: string;
};

export const createProfile = async ({
  userId,
  coverImageKey,
}: CreateProfileProps) => {
  try {
    return await db.profile.create({
      data: {
        userId,
        coverImageKey,
      },
    });
  } catch (error) {
    console.error("createProfile", error);
    return null;
  }
};

export const getProfile = async (userId: string) => {
  try {
    return await db.profile.findUnique({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.error("getProfile", error);
    return null;
  }
};

type UpdateProfileContentProps = {
  userId: string;
  title: string;
  body: string;
};

export const updateProfileContent = async ({
  userId,
  title,
  body,
}: UpdateProfileContentProps) => {
  try {
    return await db.profile.update({
      where: {
        userId,
      },
      data: {
        title,
        body,
      },
    });
  } catch (error) {
    console.error("updateProfileContent", error);
    return null;
  }
};
