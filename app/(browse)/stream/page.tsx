import { onGetStreamDataAsOwner } from "@/actions/stream-owner.actions";
import { notFound } from "next/navigation";
import { ErrorResponseType } from "@/types/action.types";
import { StreamCreate } from "./_components/StreamCreate";
import { StreamEditor } from "./_components/StreamEditor";
import { onGetSelfSubscriptionPlans } from "@/actions/subscription-plan.actions";

const StreamPage = async () => {
  const streamRes = await onGetStreamDataAsOwner();
  const subscriptionPlansRes = await onGetSelfSubscriptionPlans();

  if (streamRes.success && subscriptionPlansRes.success) {
    const { stream, user, playbackUrl, appliedThumbnailUrl } = streamRes.data;
    const { subscriptionPlans } = subscriptionPlansRes.data;

    return (
      <>
        <title>Stream Dashboard</title>
        <StreamEditor
          subscriptionPlans={subscriptionPlans}
          stream={stream}
          user={user}
          playbackUrl={playbackUrl}
          appliedThumbnailUrl={appliedThumbnailUrl}
        />
      </>
    );
  }

  if (!streamRes.success && streamRes.type === ErrorResponseType.NOT_FOUND)
    return (
      <>
        <title>Stream Create</title>
        <StreamCreate />;
      </>
    );

  return notFound();
};

export default StreamPage;
