"use client";
import { FC } from "react";
import { VideoPostDto } from "@/types/post.types";
import { BackButton } from "@/components/BackButton";
import { VideoPostDeleterModal } from "../_components/VideoPostDeleteModal";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { PostSubscriptionPlanEditor } from "@/components/PostSubscriptionPlanEditor";
import { PostContentEditor } from "@/components/PostContentEditor";

type VideoPostEditorProps = {
  videoPost: VideoPostDto;
  subscriptionPlans: SubscriptionPlanDto[];
};

export const VideoPostEditor: FC<VideoPostEditorProps> = ({
  videoPost,
  subscriptionPlans,
}) => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-2 lg:p-6">
      <div className="flex items-center gap-2">
        <BackButton href="/videos" />
        <h2 className="text-sm md:text-xl lg:text-3xl">{videoPost.title}</h2>
        <div className="ml-auto">
          <VideoPostDeleterModal id={videoPost.id} />
        </div>
      </div>
      <div>
        <PostSubscriptionPlanEditor
          subscriptionPlanId={videoPost.subscriptionPlan?.id || null}
          subscriptionPlans={subscriptionPlans}
          postId={videoPost.id}
        />
        <PostContentEditor
          postId={videoPost.id}
          title={videoPost.title}
          body={videoPost.body}
        />
      </div>
    </div>
  );
};