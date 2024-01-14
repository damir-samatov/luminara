import { db } from "@/lib/db";

export const getStreamByUserId = async (userId: string) => {
  try {
    return await db.stream.findUnique({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.error("getStreamByUserId:", error);
    return null;
  }
};
