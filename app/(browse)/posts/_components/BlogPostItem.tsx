import { FC } from "react";
import { BlogPostDto } from "@/types/post.types";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";
import { BlogPostDeleterModal } from "../_components/BlogPostDeleteModal";

type PostItemProps = {
  blogPost: BlogPostDto;
};

export const BlogPostItem: FC<PostItemProps> = async ({ blogPost }) => {
  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded bg-gray-800">
      <div className="aspect-video w-full">
        <img
          width={1920}
          height={1080}
          src={blogPost.imageUrl}
          alt={blogPost.title}
          loading="lazy"
        />
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
        <div className="ml-auto mt-auto grid grid-cols-2 gap-2">
          <Link
            href={`/posts/${blogPost.id}`}
            className="ml-auto flex w-full items-center justify-center gap-2 rounded border-2 border-gray-700 bg-transparent px-2 py-2 text-center text-xs font-semibold text-gray-100 hover:border-gray-600 hover:bg-gray-600 md:px-4 md:text-sm"
          >
            <PencilIcon className="h-3 w-3" />
            <span>Edit</span>
          </Link>
          <BlogPostDeleterModal id={blogPost.id} />
        </div>
      </div>
    </div>
  );
};
