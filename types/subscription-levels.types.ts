export type SubscriptionLevelCreateDto = {
  price: number;
  title: string;
  description: string;
  image: {
    size: number;
    type: string;
  };
};

export type SubscriptionLevelUpdateContentDto = {
  title: string;
  description: string;
};
