"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { VideoPostDto } from "@/types/post.types";
import { BackButton } from "@/components/BackButton";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { PostSubscriptionPlanEditor } from "@/components/PostSubscriptionPlanEditor";
import { PostContentEditor } from "@/components/PostContentEditor";
import { useRouter } from "next/navigation";
import { PostDeleterModal } from "@/components/PostDeleterModal";
import { VideoPostThumbnailEditor } from "../_components/VideoPostThumbnailEditor";
import { VideoPostVideoEditor } from "../_components/VideoPostVideoEditor";
import { Button } from "@/components/Button";

type VideoPostEditorProps = {
  videoPost: VideoPostDto;
  subscriptionPlans: SubscriptionPlanDto[];
};

export const VideoPostEditor: FC<VideoPostEditorProps> = ({
  videoPost,
  subscriptionPlans,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const onDeleted = useCallback(() => {
    router.push("/videos");
  }, [router]);

  const tabs = useMemo(
    () => [
      {
        label: "Video",
        component: (
          <VideoPostVideoEditor
            videoUrl={videoPost.videoUrl}
            postId={videoPost.id}
          />
        ),
      },
      {
        label: "Thumbnail",
        component: (
          <VideoPostThumbnailEditor
            imageUrl={videoPost.thumbnailUrl}
            postId={videoPost.id}
          />
        ),
      },
      {
        label: "Content",
        component: (
          <PostContentEditor
            postId={videoPost.id}
            title={videoPost.title}
            body={videoPost.body}
          />
        ),
      },
    ],
    [videoPost]
  );

  return (
    <div className="mx-auto w-full max-w-6xl p-2 lg:p-6">
      <div className="flex items-center gap-2">
        <BackButton href="/videos" />
        <h2 className="text-sm md:text-xl lg:text-3xl">{videoPost.title}</h2>
        <div className="ml-auto">
          <PostDeleterModal id={videoPost.id} onDeleted={onDeleted} />
        </div>
      </div>
      <div className="mt-8 flex flex-col-reverse gap-4 md:grid md:grid-cols-4">
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-2">
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
            subscriptionPlanId={videoPost.subscriptionPlan?.id || null}
            subscriptionPlans={subscriptionPlans}
            postId={videoPost.id}
          />
        </div>
      </div>
    </div>
  );
};
