"use server";
import { getSelf } from "@/services/auth.service";
import { getUserById } from "@/services/user.service";
import { generateViewerToken } from "@/services/livekit.service";

export const onGetViewerToken = async (hostUserId: string) => {
  const self = await getSelf();

  if (!self) throw new Error("Unauthorized");

  const hostUser = await getUserById(hostUserId);

  if (!hostUser) throw new Error("Host user not found");

  const token = generateViewerToken(self.id, self.username, hostUser.id);

  if (!token) throw new Error("Failed to generate token");

  return token;
};