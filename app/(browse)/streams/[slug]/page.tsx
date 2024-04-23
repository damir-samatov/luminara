import { notFound } from "next/navigation";
import { FC } from "react";
import { AwsStream } from "@/components/AwsStream";
import { onGetStreamWatchData } from "@/actions/stream-viewer.actions";

type LiveStreamPageProps = {
  params: {
    slug: string;
  };
};

const LiveStreamPage: FC<LiveStreamPageProps> = async ({ params }) => {
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
      <AwsStream
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

export default LiveStreamPage;
