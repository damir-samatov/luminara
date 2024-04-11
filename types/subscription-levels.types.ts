export type SubscriptionLevelCreateDto = {
  price: number;
  title: string;
  description: string;
  imageKey: string;
};

export type SubscriptionLevelUpdateContentDto = {
  title: string;
  description: string;
};
