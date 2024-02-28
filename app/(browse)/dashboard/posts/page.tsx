import { notFound } from "next/navigation";
import { onGetSelfPosts } from "@/actions/post.actions";
import { CreatePostForm } from "@/app/(browse)/dashboard/posts/_components/CreatePostForm";
import { PostItem } from "@/components/PostItem";

const PostsPage = async () => {
  const res = await onGetSelfPosts();

  if (!res.success) return notFound();

  return (
    <div className="p-4">
      <CreatePostForm />
      <div className="flex flex-col gap-4">
        {res.data.posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
