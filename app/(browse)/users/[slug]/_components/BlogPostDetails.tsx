"use client";
import { BlogPostDto } from "@/types/post.types";
import { UserDto } from "@/types/user.types";
import { CommentDto } from "@/types/comment.types";
import { FC } from "react";
import { PostContentSection } from "@/components/PostContentSection";
import { CommentsSection } from "@/components/CommentsSection";
import { useGlobalContext } from "@/contexts/GlobalContext";

type BlogPostDetailsProps = {
  blogPost: BlogPostDto;
  user: UserDto;
  comments: CommentDto[];
};

export const BlogPostDetails: FC<BlogPostDetailsProps> = ({
  blogPost,
  user,
  comments,
}) => {
  const { title, body, imageUrl, id, updatedAt } = blogPost;
  const { username, imageUrl: userImageUrl } = user;

  const { self } = useGlobalContext();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-grow flex-col gap-4 p-4 md:grid md:grid-cols-3">
      <div className="col-span-2 flex flex-col gap-4">
        <div>
          <img
            className="aspect-video"
            src={imageUrl}
            width={1920}
            height={1080}
          />
        </div>
        <PostContentSection
          editUrl={self.id === user.id ? `/posts/${id}` : null}
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
