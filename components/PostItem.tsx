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
                />
              </div>
            )
        )}
      </div>
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-3xl">{post.title}</h2>
        <p>{post.body}</p>
      </div>
    </div>
  );
};
