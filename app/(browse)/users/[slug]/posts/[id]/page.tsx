import { FC } from "react";
import { onGetBlogPostByIdAsViewer } from "@/actions/blog-post-viewer.actions";
import { notFound } from "next/navigation";
import { CommentsSection } from "@/components/CommentsSection";
import { PostContentSection } from "@/components/PostContentSection";

type BlogPostPageProps = {
  params: {
    id: string;
  };
};

const BlogPostPageProps: FC<BlogPostPageProps> = async ({ params }) => {
  const res = await onGetBlogPostByIdAsViewer({ id: params.id });
  if (!res.success) return notFound();

  const { title, body, imageUrl, updatedAt, id } = res.data.blogPost;
  const { username, imageUrl: userImageUrl } = res.data.user;

  return (
    <>
      <title>{title}</title>
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
            title={title}
            body={body}
            updatedAt={updatedAt}
            username={username}
            userImageUrl={userImageUrl}
          />
        </div>
        <CommentsSection comments={res.data.comments} postId={id} />
      </div>
    </>
  );
};

export default BlogPostPageProps;
