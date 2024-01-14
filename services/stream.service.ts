import { db } from "@/lib/db";
import { StreamUpdateDto } from "@/types/stream.types";

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

export const updateStreamByUserId = (
  userId: string,
  streamUpdateDto: StreamUpdateDto
) => {
  return db.stream.update({
    where: {
      userId,
    },
    data: { ...streamUpdateDto },
  });
};
