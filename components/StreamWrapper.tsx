"use client";
import { StreamEvents, StreamUserRoles } from "@/types/stream.types";
import { FC, useCallback, useState } from "react";
import { AwsStream } from "@/components/AwsStream";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { ChatEvent } from "amazon-ivs-chat-messaging";

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
  const router = useRouter();

  const onStreamEvent = useCallback((event: ChatEvent) => {
    if (event.eventName === StreamEvents.STREAM_ENDED) {
      setStatus(StreamEvents.STREAM_ENDED);
    }
  }, []);

  if (status === StreamEvents.STREAM_ENDED) {
    return (
      <div>
        <p>Stream Ended</p>
        <Button onClick={() => router.push(`/users/${streamerUsername}`)}>
          Ok
        </Button>
      </div>
    );
  }

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
