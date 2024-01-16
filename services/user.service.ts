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
    console.error("getUserById:", error);
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

export const getUserByUsername = async (username: string) => {
  try {
    return await db.user.findUnique({
      where: {
        username,
      },
    });
  } catch (error) {
    console.error("getUserByUsername", error);
    return null;
  }
};

export const createUser = async (userCreateDto: UserCreateDto) => {
  try {
    const { externalUserId, username, imageUrl } = userCreateDto;
    return await db.user.create({
      data: {
        externalUserId,
        username,
        imageUrl,
        stream: {
          create: {
            title: `${username}'s stream`,
          },
        },
      },
    });
  } catch (error) {
    console.error("createUser", error);
    return null;
  }
};

export const updateUser = (userUpdateDto: UserUpdateDto) => {
  try {
    const { externalUserId, username, imageUrl } = userUpdateDto;
    return db.user.update({
      where: {
        externalUserId,
      },
      data: {
        username,
        imageUrl,
      },
    });
  } catch (error) {
    console.error("updateUser", error);
    return null;
  }
};

export const deleteUserByExternalUserId = (externalUserId: string) => {
  try {
    return db.user.delete({
      where: {
        externalUserId,
      },
    });
  } catch (error) {
    console.error("deleteUserByExternalUserId", error);
    return null;
  }
};
