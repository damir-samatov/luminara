import { notFound } from "next/navigation";
import { FC } from "react";
import { onGetStreamWatchData } from "@/actions/stream-viewer.actions";
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
    } = res.data;

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
