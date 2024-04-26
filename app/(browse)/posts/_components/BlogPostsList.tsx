"use client";
import { FC, useCallback, useState } from "react";
import { BlogPostDto } from "@/types/post.types";
import { BlogPostItem } from "@/app/(browse)/posts/_components/BlogPostItem";
import { useRouter } from "next/navigation";

type BlogPostsListProps = {
  posts: BlogPostDto[];
};

export const BlogPostsList: FC<BlogPostsListProps> = ({
  posts: savedPosts,
}) => {
  const router = useRouter();
  const [posts, setPosts] = useState(savedPosts);

  const onDeleted = useCallback(
    (id: string) => {
      setPosts((prev) => prev.filter((post) => post.id !== id));
      router.refresh();
    },
    [router]
  );

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <BlogPostItem
          key={post.id}
          post={post}
          onDeleted={() => onDeleted(post.id)}
        />
      ))}
    </div>
  );
};
