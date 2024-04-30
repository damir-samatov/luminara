import { notFound } from "next/navigation";
import { FC } from "react";
import { onGetStreamWatchData } from "@/actions/stream-viewer.actions";
import { StreamStatusBanner } from "@/app/(browse)/users/[slug]/_components/StreamStatusBanner";
import { StreamWrapper } from "@/components/StreamWrapper";

type LiveStreamPageProps = {
  params: {
    slug: string;
  };
};

const StreamPage: FC<LiveStreamPageProps> = async ({ params }) => {
  const res = await onGetStreamWatchData(params.slug);

  if (res.success) {
    const {
      thumbnailUrl,
      playbackUrl,
      title,
      description,
      streamerImageUrl,
      streamerUsername,
      isChatEnabled,
      isLive,
      hasAccess,
    } = res.data;

    if (!isLive)
      return (
        <StreamStatusBanner
          streamerImageUrl={streamerImageUrl}
          streamerUsername={streamerUsername}
          text="Stream is not Live"
        />
      );

    if (!hasAccess)
      return (
        <StreamStatusBanner
          streamerImageUrl={streamerImageUrl}
          streamerUsername={streamerUsername}
          text="You don't have access to view this Stream!"
        />
      );

    return (
      <StreamWrapper
        isChatEnabled={isChatEnabled}
        title={title}
        description={description}
        streamerImageUrl={streamerImageUrl}
        streamerUsername={streamerUsername}
        playbackUrl={playbackUrl}
        thumbnailUrl={thumbnailUrl}
      />
    );
  }

  return notFound();
};

export default StreamPage;
