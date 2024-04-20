import { VideoPostCreator } from "../_components/VideoPostCreator";
import { onGetSelfSubscriptionPlans } from "@/actions/subscription-plan.actions";
import { notFound } from "next/navigation";

const NewVideoPage = async () => {
  const res = await onGetSelfSubscriptionPlans();

  if (!res.success) return notFound();

  return (
    <>
      <title>New Video</title>
      <VideoPostCreator subscriptionPlans={res.data.subscriptionPlans} />
    </>
  );
};

export default NewVideoPage;
