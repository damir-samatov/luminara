import { onGetSelfStreamDashboardData } from "@/actions/stream-owner.actions";
import { notFound } from "next/navigation";
import { ErrorResponseType } from "@/types/action.types";
import { StreamCreator } from "./_components/StreamCreator";
import { StreamEditor } from "./_components/StreamEditor";

const StreamPage = async () => {
  const res = await onGetSelfStreamDashboardData();

  if (!res.success) {
    if (res.type === ErrorResponseType.NOT_FOUND)
      return (
        <>
          <title>Stream Create</title>
          <StreamCreator />;
        </>
      );

    return notFound();
  }

  const { subscriptionPlans, user, stream, playbackUrl, thumbnailUrl } =
    res.data;

  return (
    <>
      <title>Stream Dashboard</title>
      <StreamEditor
        subscriptionPlans={subscriptionPlans}
        stream={stream}
        user={user}
        playbackUrl={playbackUrl}
        thumbnailUrl={thumbnailUrl}
      />
    </>
  );
};

export default StreamPage;
