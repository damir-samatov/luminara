import { FC } from "react";
import { Post, Image } from ".prisma/client";
import { onGetSignedFileReadUrl } from "@/actions/file.actions";
import NextImage from "next/image";

type PostItemProps = {
  post: Post & {
    images: Image[];
  };
};

export const ImagePostItem: FC<PostItemProps> = async ({ post }) => {
  const imageUrls = await Promise.all(
    post.images.map(async (image) => onGetSignedFileReadUrl({ key: image.key }))
  );

  console.log("ImagePostItem");

  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded bg-gray-800">
      <div className="grid grid-cols-2">
        {imageUrls.map(
          (res) =>
            res.success && (
              <div key={res.data.signedUrl} className="aspect-video w-full">
                <NextImage
                  width="1920"
                  height="1080"
                  src={res.data.signedUrl}
                  alt={post.title}
                  loading="lazy"
                />
              </div>
            )
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="text-end text-xs text-gray-600">
          {post.createdAt.toDateString()}
        </p>
        <h2 className="text-3xl">{post.title}</h2>
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </div>
  );
};
