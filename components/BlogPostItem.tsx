import { FC } from "react";
import { BlogPostDto } from "@/types/post.types";

type PostItemProps = {
  blogPost: BlogPostDto;
};

export const BlogPostItem: FC<PostItemProps> = async ({ blogPost }) => {
  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded bg-gray-800">
      <div className="">
        <div key={blogPost.imageUrl} className="aspect-video w-full">
          <img
            width={1920}
            height={1080}
            src={blogPost.imageUrl}
            alt={blogPost.title}
            loading="lazy"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="text-end text-xs text-gray-600">
          {blogPost.createdAt.toDateString()}
        </p>
        <h2 className="text-3xl">{blogPost.title}</h2>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: blogPost.body }}
        />
      </div>
    </div>
  );
};
