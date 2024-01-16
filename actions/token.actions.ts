"use server";
import { getSelf } from "@/services/auth.service";
import { getUserById } from "@/services/user.service";
import { generateLiveKitAccessToken } from "@/services/livekit.service";

export const createViewerToken = async (hostUserId: string) => {
  const self = await getSelf();

  if (!self) throw new Error("Unauthorized");

  const hostUser = await getUserById(hostUserId);

  if (!hostUser) throw new Error("Host user not found");

  const token = generateLiveKitAccessToken(self.id, self.username, hostUser.id);

  if (!token) throw new Error("Failed to generate token");

  return token;
};
