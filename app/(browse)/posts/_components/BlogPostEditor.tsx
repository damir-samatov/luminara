import { FC } from "react";
import { BackButton } from "@/components/BackButton";
import { BlogPostDto } from "@/types/post.types";
import { BlogPostDeleterModal } from "../_components/BlogPostDeleteModal";

type BlogPostEditorProps = {
  blogPost: BlogPostDto;
};

export const BlogPostEditor: FC<BlogPostEditorProps> = ({ blogPost }) => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-2 lg:p-6">
      <div className="flex items-center gap-2">
        <BackButton href="/posts" />
        <h2 className="text-sm md:text-xl lg:text-3xl">{blogPost.title}</h2>
        <div className="ml-auto">
          <BlogPostDeleterModal id={blogPost.id} />
        </div>
      </div>
    </div>
  );
};
