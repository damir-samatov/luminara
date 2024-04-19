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
