"use client";
import { StreamEvents, StreamUserRoles } from "@/types/stream.types";
import { FC, useCallback, useState } from "react";
import { AwsStream } from "@/components/AwsStream";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { ChatEvent } from "amazon-ivs-chat-messaging";
import Link from "next/link";
import { stringToColor } from "@/utils/style.utils";

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

  if (status === StreamEvents.USER_BANNED) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center p-4">
        <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg border-2 border-gray-700 p-6">
          <Link
            className="mx-auto flex w-full max-w-max items-end gap-2"
            href={`/users/${streamerUsername}`}
          >
            <img
              className="h-12 w-12 rounded-full"
              src={streamerImageUrl}
              alt={streamerUsername}
              height={360}
              width={360}
              loading="eager"
            />
            <p className="text-lg">
              <span
                style={{
                  color: stringToColor(streamerUsername),
                }}
              >
                @
              </span>
              <span>{streamerUsername}</span>
            </p>
          </Link>
          <div>
            <p className="text-center text-xl">
              Ypu have been banned from the stream!
            </p>
          </div>
          <Button
            className="mx-auto max-w-60"
            onClick={() => router.push(`/users/${streamerUsername}`)}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (status === StreamEvents.STREAM_ENDED) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center p-4">
        <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg border-2 border-gray-700 p-6">
          <Link
            className="mx-auto flex w-full max-w-max items-end gap-2"
            href={`/users/${streamerUsername}`}
          >
            <img
              className="h-12 w-12 rounded-full"
              src={streamerImageUrl}
              alt={streamerUsername}
              height={360}
              width={360}
              loading="eager"
            />
            <p className="text-lg">
              <span
                style={{
                  color: stringToColor(streamerUsername),
                }}
              >
                @
              </span>
              <span>{streamerUsername}</span>
            </p>
          </Link>
          <div>
            <p className="text-center text-xl">Stream has ended</p>
            <p className="text-center text-xl">Thank you, for watching!</p>
          </div>
          <Button
            className="mx-auto max-w-60"
            onClick={() => router.push(`/users/${streamerUsername}`)}
          >
            Go Back
          </Button>
        </div>
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
