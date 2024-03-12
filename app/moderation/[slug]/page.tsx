import { onGetStreamDataAsModerator } from "@/actions/stream-viewer.actions";
import { notFound } from "next/navigation";
import { AwsStream } from "@/components/AwsStream";
import { FC } from "react";
import Head from "next/head";

type StreamModerationPageProps = {
  params: {
    slug: string;
  };
};

const StreamModerationPage: FC<StreamModerationPageProps> = async ({
  params,
}) => {
  const res = await onGetStreamDataAsModerator(params.slug);

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

  return (
    <>
      <Head>
        <title>Moderation of {params.slug}&apos;s Stream</title>
      </Head>
      <AwsStream
        isChatEnabled={isChatEnabled}
        title={title}
        description={description}
        streamerImageUrl={streamerImageUrl}
        streamerUsername={streamerUsername}
        playbackUrl={playbackUrl}
        thumbnailUrl={thumbnailUrl}
        isModerator
      />
    </>
  );
};

export default StreamModerationPage;

export const metadata = {
  title: "Stream Moderation",
};
