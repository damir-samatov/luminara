import { FC } from "react";
import { onGetBlogPostByIdAsViewer } from "@/actions/blog-post-viewer.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { stringToColor } from "@/utils/style.utils";
import { CommentsSection } from "@/components/CommentsSection";

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
          <Link
            className="flex w-max items-end gap-2"
            href={`/users/${username}`}
          >
            <img
              className="h-12 w-12 rounded-full"
              src={userImageUrl}
              alt={username}
              height={360}
              width={360}
              loading="eager"
            />
            <p className="text-lg">
              <span
                style={{
                  color: stringToColor(username),
                }}
              >
                @
              </span>
              <span>{username}</span>
            </p>
          </Link>
          <h2 className="text-lg lg:text-3xl">{title}</h2>
          <p className="text-xs text-gray-500">{updatedAt.toDateString()}</p>
          <div>
            <img
              className="aspect-video"
              src={imageUrl}
              width={1920}
              height={1080}
            />
          </div>
          <div
            className="hidden text-sm lg:block"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>

        <div>
          <CommentsSection comments={res.data.comments} postId={id} />
        </div>
      </div>
    </>
  );
};

export default BlogPostPageProps;
