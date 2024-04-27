import { FC } from "react";
import { notFound } from "next/navigation";
import { BlogPostEditor } from "../_components/BlogPostEditor";
import { onGetBlogPostById } from "@/actions/blog-post.actions";
import { onGetSelfSubscriptionPlans } from "@/actions/subscription-plan.actions";

type BlogPostDetailsPageProps = {
  params: {
    id: string;
  };
};

const BlogPostEditorPage: FC<BlogPostDetailsPageProps> = async ({ params }) => {
  const [blogPostRes, subscriptionPlansRes] = await Promise.all([
    onGetBlogPostById(params.id),
    onGetSelfSubscriptionPlans(),
  ]);

  if (!blogPostRes.success || !subscriptionPlansRes.success) return notFound();

  return (
    <>
      <title>{`Edit - ${blogPostRes.data.blogPost.title}`}</title>
      <BlogPostEditor
        blogPost={blogPostRes.data.blogPost}
        subscriptionPlans={subscriptionPlansRes.data.subscriptionPlans}
      />
    </>
  );
};

export default BlogPostEditorPage;
