import { onGetStreamModerationData } from "@/actions/stream-viewer.actions";
import { notFound } from "next/navigation";
import { FC } from "react";
import Head from "next/head";
import { StreamUserRoles } from "@/types/stream.types";
import { stringToColor } from "@/utils/style.utils";
import { StreamWrapper } from "@/components/StreamWrapper";

type StreamModerationPageProps = {
  params: {
    slug: string;
  };
};

const StreamModerationPage: FC<StreamModerationPageProps> = async ({
  params,
}) => {
  const res = await onGetStreamModerationData(params.slug);

  if (!res.success) return notFound();

  const {
    thumbnailUrl,
    playbackUrl,
    title,
    description,
    streamerImageUrl,
    streamerUsername,
    isChatEnabled,
  } = res.data;

  const color = stringToColor(streamerUsername);

  return (
    <>
      <Head>
        <title>Moderation of {params.slug}&apos;s Stream</title>
      </Head>
      <div className="flex flex-grow flex-col">
        <div className="text-md bg-gray-900 p-4 text-center">
          <span style={{ color }}>@</span>
          {streamerUsername}&apos;s Stream Moderation
        </div>
        <StreamWrapper
          isChatEnabled={isChatEnabled}
          title={title}
          description={description}
          streamerImageUrl={streamerImageUrl}
          streamerUsername={streamerUsername}
          playbackUrl={playbackUrl}
          thumbnailUrl={thumbnailUrl}
          userRole={StreamUserRoles.STREAMER}
        />
      </div>
    </>
  );
};

export default StreamModerationPage;

export const metadata = {
  title: "Stream Moderation",
};
