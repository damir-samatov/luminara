"use server";
import { User } from ".prisma/client";
import { getSelf } from "@/services/auth.service";

type GetDashboardDataResponse =
  | {
      success: true;
      data: {
        self: User;
      };
    }
  | {
      success: false;
      message: string;
    };

export const getDashboardData = async (): Promise<GetDashboardDataResponse> => {
  try {
    const self = await getSelf();
    if (!self) return { success: false, message: "Unauthorized" };
    return { success: true, data: { self } };
  } catch (error) {
    console.log("getDashboardData", error);
    return { success: false, message: "Something went wrong" };
  }
};
