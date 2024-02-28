"use server";
import { FC } from "react";
import { Post, Video, Image } from ".prisma/client";
import { onGetSignedFileReadUrl } from "@/actions/file.actions";
import NextImage from "next/image";

type PostItemProps = {
  post: Post & {
    videos: Video[];
    images: Image[];
  };
};

export const PostItem: FC<PostItemProps> = async ({ post }) => {
  const imageUrls = await Promise.all(
    post.images.map(async (image) => onGetSignedFileReadUrl({ key: image.key }))
  );

  const videoUrls = await Promise.all(
    post.videos.map(async (video) => onGetSignedFileReadUrl({ key: video.key }))
  );

  return (
    <>
      {imageUrls.map(
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
      )}
      {videoUrls.map(
        (res) =>
          res.success && (
            <video
              controls
              autoPlay
              muted
              key={res.data.signedUrl}
              className="w-96"
              width="100"
              height="100"
              src={res.data.signedUrl}
            />
          )
      )}
    </>
  );
};
