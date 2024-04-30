"use server";
import { db } from "@/lib/db";
import { UserCreateDto, UserUpdateDto } from "@/types/user.types";

export const getUserById = async (id: string) => {
  try {
    return await db.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("getUserById", error);
    return null;
  }
};

export const getUserByExternalUserId = async (externalUserId: string) => {
  try {
    return await db.user.findUnique({
      where: {
        externalUserId,
      },
    });
  } catch (error) {
    console.error("getUserByExternalUserId", error);
    return null;
  }
};

export const getUserIdByExternalUserId = async (externalUserId: string) => {
  try {
    return await db.user.findUnique({
      where: {
        externalUserId,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    console.error("getUserIdByExternalUserId", error);
    return null;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    return await db.user.findUnique({
      where: {
        username,
      },
      include: {
        profile: true,
      },
    });
  } catch (error) {
    console.error("getUserByUsername", error);
    return null;
  }
};

export const getUserIdByUsername = async (username: string) => {
  try {
    return await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    console.error("getUserByUsername", error);
    return null;
  }
};

export const createUser = async (userCreateDto: UserCreateDto) => {
  try {
    const { externalUserId, username, imageUrl, firstName, lastName } =
      userCreateDto;
    return await db.user.create({
      data: {
        externalUserId,
        username,
        firstName,
        lastName,
        imageUrl,
      },
    });
  } catch (error) {
    console.error("createUser", error);
    return null;
  }
};

export const updateUser = async (userUpdateDto: UserUpdateDto) => {
  try {
    const { externalUserId, username, imageUrl, firstName, lastName } =
      userUpdateDto;
    return await db.user.update({
      where: {
        externalUserId,
      },
      data: {
        username,
        firstName,
        lastName,
        imageUrl,
      },
    });
  } catch (error) {
    console.error("updateUser", error);
    return null;
  }
};

export const deleteUserByExternalUserId = async (externalUserId: string) => {
  try {
    return await db.user.delete({
      where: {
        externalUserId,
      },
    });
  } catch (error) {
    console.error("deleteUserByExternalUserId", error);
    return null;
  }
};

export const searchUserByUsername = async (
  userId: string,
  usernameSearch: string
) => {
  try {
    return await db.user.findMany({
      take: 20,
      where: {
        OR: [
          {
            username: {
              contains: usernameSearch,
              mode: "insensitive",
            },
          },
          {
            firstName: {
              contains: usernameSearch,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: usernameSearch,
              mode: "insensitive",
            },
          },
        ],
        bannedUsers: {
          none: {
            bannedUserId: userId,
          },
        },
      },
    });
  } catch (error) {
    console.error("searchUserByUsername", error);
    return null;
  }
};
