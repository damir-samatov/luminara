"use client";
import { StreamEvents, StreamUserRoles } from "@/types/stream.types";
import { FC, useCallback, useState } from "react";
import { AwsStream } from "@/components/AwsStream";
import { ChatEvent } from "amazon-ivs-chat-messaging";
import { StreamStatusBanner } from "@/app/(browse)/users/[slug]/_components/StreamStatusBanner";

type StreamWrapperProps = {
  streamerImageUrl: string;
  streamerUsername: string;
  playbackUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  isChatEnabled: boolean;
  userRole?: StreamUserRoles;
};

export const StreamWrapper: FC<StreamWrapperProps> = ({
  playbackUrl,
  thumbnailUrl,
  title,
  description,
  streamerUsername,
  streamerImageUrl,
  isChatEnabled,
  userRole,
}) => {
  const [status, setStatus] = useState("");
  const onStreamEvent = useCallback((event: ChatEvent) => {
    if (event.eventName === StreamEvents.STREAM_ENDED) {
      setStatus(StreamEvents.STREAM_ENDED);
    }
  }, []);

  if (status === StreamEvents.USER_BANNED)
    return (
      <StreamStatusBanner
        streamerImageUrl={streamerImageUrl}
        streamerUsername={streamerUsername}
        text="You have been banned!"
      />
    );

  if (status === StreamEvents.STREAM_ENDED)
    return (
      <StreamStatusBanner
        streamerImageUrl={streamerImageUrl}
        streamerUsername={streamerUsername}
        text="Stream has ended!"
      />
    );

  return (
    <AwsStream
      playbackUrl={playbackUrl}
      thumbnailUrl={thumbnailUrl}
      title={title}
      description={description}
      streamerUsername={streamerUsername}
      streamerImageUrl={streamerImageUrl}
      isChatEnabled={isChatEnabled}
      userRole={userRole}
      onStreamEvent={onStreamEvent}
    />
  );
};
