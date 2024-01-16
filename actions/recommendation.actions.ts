"use server";
import { getSelf } from "@/services/auth.service";
import { getRecommendationsByUserId } from "@/services/recommendation.service";

export const getRecommendations = async () => {
  const self = await getSelf();

  if (!self) throw new Error("Unauthorized");

  const recommendations = await getRecommendationsByUserId(self.id);

  if (!recommendations) throw new Error("Failed to get recommendations");

  return recommendations;
};
