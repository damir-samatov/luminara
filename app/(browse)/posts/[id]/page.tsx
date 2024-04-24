import { FC } from "react";
import { notFound } from "next/navigation";
import { BlogPostEditor } from "../_components/BlogPostEditor";
import { onGetBlogPostById } from "@/actions/post.actions";

type BlogPostDetailsPageProps = {
  params: {
    id: string;
  };
};

const BlogPostEditorPage: FC<BlogPostDetailsPageProps> = async ({ params }) => {
  const res = await onGetBlogPostById(params.id);

  if (!res.success) return notFound();

  return (
    <>
      <title>Blog Post Editor {params.id}</title>
      <BlogPostEditor blogPost={res.data.blogPost} />
    </>
  );
};

export default BlogPostEditorPage;
