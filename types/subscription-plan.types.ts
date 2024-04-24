export type SubscriptionPlanCreateDto = {
  price: number;
  title: string;
  description: string;
  image: {
    size: number;
    type: string;
  };
};

export type SubscriptionPlanUpdateContentDto = {
  title: string;
  description: string;
};

export type SubscriptionPlanDto = {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  imageKey: string;
  createdAt: Date;
  updatedAt: Date;
};
