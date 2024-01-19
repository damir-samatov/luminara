import { StreamWrapper } from "@/components/StreamWrapper";
import { notFound } from "next/navigation";
import { FC } from "react";
import { onGetStreamByUsername } from "@/actions/stream.actions";

type LiveStreamPageProps = {
  params: {
    slug: string;
  };
};

const LiveStreamPage: FC<LiveStreamPageProps> = async ({ params }) => {
  const res = await onGetStreamByUsername(params.slug);

  if (!res.success) return notFound();

  const { stream } = res.data;

  return <StreamWrapper hostUserId={stream.userId} />;
};

export default LiveStreamPage;
