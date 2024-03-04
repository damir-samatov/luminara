import { notFound } from "next/navigation";
import { FC } from "react";
import { onGetStreamDataAsViewer } from "@/actions/stream.actions";
import { AwsStream } from "@/components/AwsStream";

type LiveStreamPageProps = {
  params: {
    slug: string;
  };
};

const LiveStreamPage: FC<LiveStreamPageProps> = async ({ params }) => {
  const res = await onGetStreamDataAsViewer(params.slug);

  if (!res.success) return notFound();

  const {
    thumbnailUrl,
    playbackUrl,
    title,
    chatRoomToken,
    description,
    streamerImageUrl,
    streamerUsername,
  } = res.data;

  return (
    <AwsStream
      title={title}
      description={description}
      streamerImageUrl={streamerImageUrl}
      streamerUsername={streamerUsername}
      playbackUrl={playbackUrl}
      thumbnailUrl={thumbnailUrl}
      chatRoomToken={chatRoomToken}
    />
  );
};

export default LiveStreamPage;
