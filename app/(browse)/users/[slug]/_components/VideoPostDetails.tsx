"use client";
import { VideoPostDto } from "@/types/post.types";
import { UserDto } from "@/types/user.types";
import { CommentDto } from "@/types/comment.types";
import { FC } from "react";
import { PostContentSection } from "@/components/PostContentSection";
import { CommentsSection } from "@/components/CommentsSection";
import { useGlobalContext } from "@/contexts/GlobalContext";

type VideoPostDetailsProps = {
  videoPost: VideoPostDto;
  user: UserDto;
  comments: CommentDto[];
};

export const VideoPostDetails: FC<VideoPostDetailsProps> = ({
  videoPost,
  user,
  comments,
}) => {
  const { title, body, videoUrl, thumbnailUrl, id, updatedAt } = videoPost;
  const { username, imageUrl: userImageUrl } = user;

  const { self } = useGlobalContext();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-grow flex-col gap-4 p-4 md:grid md:grid-cols-3">
      <div className="col-span-2 flex flex-col gap-4">
        <div>
          <video
            src={videoUrl}
            poster={thumbnailUrl}
            controls
            className="aspect-video w-full overflow-hidden rounded-xl bg-black object-contain"
          />
        </div>
        <PostContentSection
          editUrl={self.id === user.id ? `/videos/${id}` : null}
          title={title}
          body={body}
          updatedAt={updatedAt}
          username={username}
          userImageUrl={userImageUrl}
        />
      </div>
      <CommentsSection comments={comments} postId={id} />
    </div>
  );
};
