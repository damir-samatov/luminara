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
  userId: string;
  title: string;
  body: string;
  videos: {
    title: string;
    key: string;
    thumbnailKey: string;
  }[];
};

export type PostContent = {
  title: string;
  body: string;
};
