"use server";
import { Stream, User } from ".prisma/client";
import { getSelf } from "@/services/auth.service";
import { getStreamByUserId } from "@/services/stream.service";

type GetDashboardDataResponse =
  | {
      success: true;
      data: {
        self: User;
        stream: Stream;
      };
    }
  | {
      success: false;
      message: string;
    };

export const getDashboardData = async (): Promise<GetDashboardDataResponse> => {
  try {
    const self = await getSelf();

    if (!self)
      return {
        success: false,
        message: "Unauthorized",
      };

    const stream = await getStreamByUserId(self.id);

    if (!stream) {
      return {
        success: false,
        message: "Stream not found",
      };
    }

    return {
      success: true,
      data: {
        self,
        stream,
      },
    };
  } catch (error) {
    console.log("getDashboardData", error);
    return { success: false, message: "Something went wrong" };
  }
};
