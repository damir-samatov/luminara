"use client";
import { FC } from "react";
import { BackButton } from "@/components/BackButton";
import { BlogPostDto } from "@/types/post.types";
import { BlogPostDeleterModal } from "../_components/BlogPostDeleteModal";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { PostSubscriptionPlanEditor } from "@/components/PostSubscriptionPlanEditor";
import { PostContentEditor } from "@/components/PostContentEditor";

type BlogPostEditorProps = {
  blogPost: BlogPostDto;
  subscriptionPlans: SubscriptionPlanDto[];
};

export const BlogPostEditor: FC<BlogPostEditorProps> = ({
  blogPost,
  subscriptionPlans,
}) => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-2 lg:p-6">
      <div className="flex items-center gap-2">
        <BackButton href="/posts" />
        <h2 className="text-sm md:text-xl lg:text-3xl">{blogPost.title}</h2>
        <div className="ml-auto">
          <BlogPostDeleterModal id={blogPost.id} />
        </div>
      </div>
      <PostSubscriptionPlanEditor
        subscriptionPlanId={blogPost.subscriptionPlan?.id || null}
        subscriptionPlans={subscriptionPlans}
        postId={blogPost.id}
      />
      <PostContentEditor
        postId={blogPost.id}
        title={blogPost.title}
        body={blogPost.body}
      />
    </div>
  );
};
