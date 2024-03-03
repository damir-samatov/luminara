import { notFound } from "next/navigation";
import { FC } from "react";
import { onGetStreamViewerData } from "@/actions/stream.actions";
import { AwsStreamPlayer } from "@/components/AwsStreamPlayer";
import { AwsChatRoom } from "@/components/AwsChatRoom";

type LiveStreamPageProps = {
  params: {
    slug: string;
  };
};

const LiveStreamPage: FC<LiveStreamPageProps> = async ({ params }) => {
  const res = await onGetStreamViewerData(params.slug);

  if (!res.success) return notFound();

  const { thumbnailUrl, playbackUrl, title } = res.data.streamData;
  const { chatRoomToken } = res.data.chatRoomData;

  return (
    <div className="relative h-full w-full flex-grow">
      <div className="pr-96">
        <div className="flex flex-col gap-4 p-4">
          <AwsStreamPlayer
            playbackUrl={playbackUrl}
            thumbnailUrl={thumbnailUrl}
          />
          <h1 className="text-3xl">{title}</h1>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 top-0 w-full max-w-96 bg-gray-900 p-4">
        <AwsChatRoom chatRoomToken={chatRoomToken} />
      </div>
    </div>
  );
};

export default LiveStreamPage;
