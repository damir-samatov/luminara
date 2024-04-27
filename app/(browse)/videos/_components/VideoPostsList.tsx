"use client";
import { FC, useCallback, useState } from "react";
import { VideoPostDto } from "@/types/post.types";
import { VideoPostItem } from "@/app/(browse)/videos/_components/VideoPostItem";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";
import { PostDeleterModal } from "@/components/PostDeleterModal";

type VideoPostsListProps = {
  posts: VideoPostDto[];
};

export const VideoPostsList: FC<VideoPostsListProps> = ({
  posts: savedPosts,
}) => {
  const [posts, setPosts] = useState(savedPosts);

  const onDeleted = useCallback((id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {posts.map((post) => (
        <VideoPostItem
          key={post.id}
          link={`/videos/${post.id}`}
          title={post.title}
          videoUrl={post.videoUrl}
          thumbnailUrl={post.thumbnailUrl}
          date={post.createdAt}
          actions={
            <div className="flex flex-col gap-1 rounded-lg border-2 border-gray-700 bg-gray-950 p-2">
              <Link
                href={`/videos/${post.id}`}
                className="ml-auto flex w-full items-center justify-center gap-2 rounded border-2 border-gray-700 bg-transparent px-2 py-2 text-center text-xs font-semibold text-gray-100 hover:border-gray-600 hover:bg-gray-600 md:px-4 md:text-sm"
              >
                <PencilIcon className="h-3 w-3" />
                <span>Edit</span>
              </Link>
              <PostDeleterModal
                id={post.id}
                onDeleted={() => onDeleted(post.id)}
              />
            </div>
          }
        />
      ))}
    </div>
  );
};
