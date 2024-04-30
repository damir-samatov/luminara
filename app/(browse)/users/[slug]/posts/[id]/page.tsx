import { FC } from "react";
import { onGetBlogPostByIdAsViewer } from "@/actions/blog-post-viewer.actions";
import { notFound } from "next/navigation";
import { BlogPostDetails } from "../../_components/BlogPostDetails";

type BlogPostPageProps = {
  params: {
    id: string;
  };
};

const BlogPostPageProps: FC<BlogPostPageProps> = async ({ params }) => {
  const res = await onGetBlogPostByIdAsViewer({ id: params.id });
  if (!res.success) return notFound();
  return (
    <>
      <title>{res.data.blogPost.title}</title>
      <BlogPostDetails
        blogPost={res.data.blogPost}
        user={res.data.user}
        comments={res.data.comments}
      />
    </>
  );
};

export default BlogPostPageProps;
