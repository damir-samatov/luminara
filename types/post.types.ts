export type PostCreateDto = {
  userId: string;
  title: string;
  body: string;
  images: {
    title: string;
    key: string;
  }[];
};
