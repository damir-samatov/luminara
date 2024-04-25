import { FC } from "react";
import { VideoPostEditor } from "../_components/VideoPostEditor";
import { onGetVideoPostById } from "@/actions/video-post.actions";
import { notFound } from "next/navigation";
import { onGetSelfSubscriptionPlans } from "@/actions/subscription-plan.actions";

type VideoPostDetailsPageProps = {
  params: {
    id: string;
  };
};

const VideoPostEditorPage: FC<VideoPostDetailsPageProps> = async ({
  params,
}) => {
  const res = await onGetVideoPostById(params.id);

  if (!res.success) return notFound();

  const [videoPostRes, subscriptionPlansRes] = await Promise.all([
    onGetVideoPostById(params.id),
    onGetSelfSubscriptionPlans(),
  ]);

  if (!videoPostRes.success || !subscriptionPlansRes.success) return notFound();

  return (
    <>
      <title>Video Editor {params.id}</title>
      <VideoPostEditor
        videoPost={videoPostRes.data.videoPost}
        subscriptionPlans={subscriptionPlansRes.data.subscriptionPlans}
      />
    </>
  );
};

export default VideoPostEditorPage;
