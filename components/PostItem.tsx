"use server";
import { FC } from "react";
import { Post, Image } from ".prisma/client";
import { onGetSignedFileReadUrl } from "@/actions/file.actions";
import NextImage from "next/image";

type PostItemProps = {
  post: Post & {
    images: Image[];
  };
};

export const PostItem: FC<PostItemProps> = async ({ post }) => {
  const imageUrls = await Promise.all(
    post.images.map(async (image) => onGetSignedFileReadUrl({ key: image.key }))
  );

  return imageUrls.map(
    (res) =>
      res.success && (
        <NextImage
          key={res.data.signedUrl}
          className="w-96"
          width="1600"
          height="900"
          src={res.data.signedUrl}
          alt={post.title}
        />
      )
  );
};
