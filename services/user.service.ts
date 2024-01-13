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
    return await db.user.findFirst({
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
  const { externalUserId, username, imageUrl } = userCreateDto;
  return db.user.create({
    data: {
      externalUserId,
      username,
      imageUrl,
    },
  });
};

export const updateUser = (userUpdateDto: UserUpdateDto) => {
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
};

export const deleteUserByExternalUserId = (externalUserId: string) => {
  return db.user.delete({
    where: {
      externalUserId,
    },
  });
};
