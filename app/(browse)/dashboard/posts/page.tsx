import { notFound } from "next/navigation";
import { onGetSelfPosts } from "@/actions/post.actions";
import { PostItem } from "@/components/PostItem";
import { classNames } from "@/utils/style.utils";
import Link from "next/link";
import React from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

const PostsPage = async () => {
  const res = await onGetSelfPosts();

  if (!res.success) return notFound();

  return (
    <div className="p-4">
      <Link
        href="/dashboard/posts/new"
        className={classNames(
          "ml-auto flex max-w-max items-center gap-2 rounded-md bg-gray-800 p-4 text-sm font-semibold leading-6 text-gray-100"
        )}
      >
        <PencilIcon className="h-6 w-6" />
        <span>New Post</span>
      </Link>
      <div className="flex flex-col gap-4">
        {res.data.posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
