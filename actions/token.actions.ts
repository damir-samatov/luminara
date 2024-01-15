"use server";
import { getSelf } from "@/services/auth.service";
import { getUserById } from "@/services/user.service";
import { generateLiveKitAccessToken } from "@/services/livekit.service";

export const createViewerToken = async (hostId: string) => {
  const self = await getSelf();

  if (!self) throw new Error("Unauthorized");

  const hostUser = await getUserById(hostId);

  if (!hostUser) throw new Error("Host user not found");

  return generateLiveKitAccessToken(self.id, self.username, hostUser.id);
};
