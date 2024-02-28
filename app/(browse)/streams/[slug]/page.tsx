import { notFound } from "next/navigation";
import { FC } from "react";
import { onGetStreamByUsername } from "@/actions/stream.actions";
import { AwsStreamPlayer } from "@/components/AwsStreamPlayer";

type LiveStreamPageProps = {
  params: {
    slug: string;
  };
};

const LiveStreamPage: FC<LiveStreamPageProps> = async ({ params }) => {
  const res = await onGetStreamByUsername(params.slug);

  if (!res.success) return notFound();

  const { stream } = res.data;

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <h1 className="text-3xl">{stream.title}</h1>
      <AwsStreamPlayer />
    </div>
  );
};

export default LiveStreamPage;
