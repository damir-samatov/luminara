import { notFound } from "next/navigation";
import { onGetSelfBlogPosts } from "@/actions/blog-post.actions";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { BlogPostsList } from "@/app/(browse)/posts/_components/BlogPostsList";

const PostsPage = async () => {
  const res = await onGetSelfBlogPosts();
  if (!res.success) return notFound();
  return (
    <>
      <title>My Blog Posts</title>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm md:text-xl lg:text-3xl">My Blog Posts</h2>
          <Link
            href="/posts/new"
            className="ml-auto flex w-full max-w-max items-center gap-1 rounded border-2 border-gray-700 bg-transparent px-2 py-2 text-center text-xs font-semibold text-gray-100 hover:border-gray-600 hover:bg-gray-600 md:px-4 md:text-sm"
          >
            <span>New Post</span>
            <PlusIcon className="mx-auto h-3 w-3" />
          </Link>
        </div>
        <BlogPostsList posts={res.data.blogPosts} />
      </div>
    </>
  );
};

export default PostsPage;
