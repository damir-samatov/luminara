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
      <pre>{JSON.stringify(res, null, 2)}</pre>
      {res.data.posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsPage;
