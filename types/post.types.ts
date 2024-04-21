export type ImagePostCreateDto = {
  userId: string;
  title: string;
  body: string;
  images: {
    title: string;
    key: string;
  }[];
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

export type PostContent = {
  title: string;
  body: string;
};
