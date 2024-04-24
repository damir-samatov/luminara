import { BlogPostCreator } from "@/app/(browse)/posts/_components/BlogPostCreator";
import { onGetSelfSubscriptionPlans } from "@/actions/subscription-plan.actions";
import { notFound } from "next/navigation";

const PostCreatePage = async () => {
  const res = await onGetSelfSubscriptionPlans();
  if (!res.success) return notFound();
  return (
    <>
      <title>New Blog Post</title>
      <BlogPostCreator
        subscriptionPlans={res.data.subscriptionPlans}
        freeFollowerImageUrl={res.data.freeFollowerImageUrl}
      />
    </>
  );
};

export default PostCreatePage;
