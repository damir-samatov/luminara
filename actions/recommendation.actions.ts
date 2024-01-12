"use server";
import { getSelf } from "@/services/auth.service";
import { getRecommendationsByUserId } from "@/services/recommendation.service";

export const getRecommendations = async () => {
  const self = await getSelf();

  if (!self) return [];

  return await getRecommendationsByUserId(self.id);
};
