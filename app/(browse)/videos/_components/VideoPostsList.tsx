"use client";
import { FC, useCallback, useState } from "react";
import { VideoPostDto } from "@/types/post.types";
import { VideoPostItem } from "@/app/(browse)/videos/_components/VideoPostItem";

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
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <VideoPostItem
          key={post.id}
          post={post}
          onDeleted={() => onDeleted(post.id)}
        />
      ))}
    </div>
  );
};
