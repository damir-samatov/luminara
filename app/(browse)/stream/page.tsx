import { onGetStreamDataAsOwner } from "@/actions/stream-owner.actions";
import { notFound } from "next/navigation";
import { ErrorResponseType } from "@/types/action.types";
import { StreamCreate } from "./_components/StreamCreate";
import { StreamEditor } from "./_components/StreamEditor";
import { onGetSelfSubscriptionLevels } from "@/actions/subscription-level.actions";

const StreamPage = async () => {
  const streamRes = await onGetStreamDataAsOwner();
  const subscriptionLevelsRes = await onGetSelfSubscriptionLevels();

  if (streamRes.success && subscriptionLevelsRes.success) {
    const { stream, user, playbackUrl, appliedThumbnailUrl } = streamRes.data;
    const { subscriptionLevels } = subscriptionLevelsRes.data;

    return (
      <>
        <title>Stream Dashboard</title>
        <StreamEditor
          subscriptionLevels={subscriptionLevels}
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
