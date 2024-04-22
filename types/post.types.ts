import { SubscriptionPlan } from "@prisma/client";

export type BlogPostCreateDto = {
  title: string;
  body: string;
  subscriptionPlanId: string | null;
  image: {
    type: string;
    size: number;
  };
};

export type VideoPostCreateDto = {
  title: string;
  body: string;
  subscriptionPlanId: string | null;
  video: {
    type: string;
    size: number;
  };
  thumbnail: {
    type: string;
    size: number;
  };
};

export type VideoPostDto = {
  id: string;
  title: string;
  body: string;
  videoUrl: string;
  thumbnailUrl: string;
  subscriptionPlan: SubscriptionPlan | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PostContent = {
  title: string;
  body: string;
};
