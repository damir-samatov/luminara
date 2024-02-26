import { MediaType } from "@prisma/client";

export type PostCreateDto = {
  userId: string;
  title: string;
  body: string;
  medias: {
    mediaType: MediaType;
    title: string;
    url: string;
  }[];
};
