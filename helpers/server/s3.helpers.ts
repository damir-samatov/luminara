"use server";
import { v4 as uuid } from "uuid";

export const generateFileKey = (userId: string) => {
  console.log(userId);
  return `${userId}_${uuid()}`;
};

export const extractUserIdFromFileKey = (key: string) => {
  return key.split("_")[0] || "";
};
