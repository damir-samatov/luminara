"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { BackButton } from "@/components/BackButton";
import { BlogPostDto } from "@/types/post.types";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { PostSubscriptionPlanEditor } from "@/components/PostSubscriptionPlanEditor";
import { PostContentEditor } from "@/components/PostContentEditor";
import { PostDeleterModal } from "@/components/PostDeleterModal";
import { useRouter } from "next/navigation";
import { BlogPostImageEditor } from "../_components/BlogPostImageEditor";
import { Button } from "@/components/Button";

type BlogPostEditorProps = {
  blogPost: BlogPostDto;
  subscriptionPlans: SubscriptionPlanDto[];
};

export const BlogPostEditor: FC<BlogPostEditorProps> = ({
  blogPost,
  subscriptionPlans,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const onDeleted = useCallback(() => {
    router.push("/posts");
  }, [router]);

  const tabs = useMemo(
    () => [
      {
        label: "Content",
        component: (
          <PostContentEditor
            postId={blogPost.id}
            title={blogPost.title}
            body={blogPost.body}
          />
        ),
      },
      {
        label: "Image",
        component: (
          <BlogPostImageEditor
            imageUrl={blogPost.imageUrl}
            postId={blogPost.id}
          />
        ),
      },
    ],
    [blogPost]
  );

  return (
    <div className="mx-auto w-full max-w-5xl p-2 lg:p-6">
      <div className="flex items-center gap-2">
        <BackButton href="/posts" />
        <h2 className="text-sm md:text-xl lg:text-3xl">{blogPost.title}</h2>
        <div className="ml-auto">
          <PostDeleterModal id={blogPost.id} onDeleted={onDeleted} />
        </div>
      </div>
      <div className="mt-8 flex flex-col-reverse gap-4 md:grid md:grid-cols-4">
        <div className="col-span-3">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab, i) => (
              <Button
                type={activeTab === i ? "primary" : "secondary"}
                onClick={() => setActiveTab(i)}
                key={tab.label}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          <div className="mt-4">{tabs[activeTab]?.component}</div>
        </div>
        <div>
          <PostSubscriptionPlanEditor
            subscriptionPlanId={blogPost.subscriptionPlan?.id || null}
            subscriptionPlans={subscriptionPlans}
            postId={blogPost.id}
          />
        </div>
      </div>
    </div>
  );
};
