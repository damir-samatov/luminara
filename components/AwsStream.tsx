"use client";
import { FC } from "react";
import { AwsStreamPlayer } from "@/components/AwsStreamPlayer";
import { AwsChatRoom } from "@/components/AwsChatRoom";
import Link from "next/link";
import { classNames, stringToColor } from "@/utils/style.utils";
import { StreamUserRoles } from "@/types/stream.types";
import { ChatEvent } from "amazon-ivs-chat-messaging";

type AwsStreamProps = {
  streamerImageUrl: string;
  streamerUsername: string;
  playbackUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  isChatEnabled: boolean;
  userRole?: StreamUserRoles;
  onStreamEvent?: (event: ChatEvent) => void;
};

export const AwsStream: FC<AwsStreamProps> = ({
  playbackUrl,
  thumbnailUrl,
  title,
  description,
  streamerUsername,
  streamerImageUrl,
  isChatEnabled,
  userRole = StreamUserRoles.VIEWER,
  onStreamEvent,
}) => {
  const streamerColor = stringToColor(streamerUsername);

  return (
    <div className="relative flex h-full w-full flex-grow flex-col gap-4">
      <div
        className={classNames(
          "absolute left-0 right-0 top-0 overflow-y-auto overflow-x-hidden p-4 lg:bottom-0",
          isChatEnabled ? "bottom-72 lg:right-96" : "bottom-0"
        )}
      >
        <AwsStreamPlayer
          playbackUrl={playbackUrl}
          thumbnailUrl={thumbnailUrl}
          fallbackThumbnailUrl={streamerImageUrl}
        />
        <div className="mt-4 flex flex-col gap-2">
          <Link
            className="flex w-max items-end gap-2"
            href={`/users/${streamerUsername}`}
          >
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <img
                src={streamerImageUrl}
                alt={streamerUsername}
                height={120}
                width={120}
                loading="eager"
              />
            </div>
            <p className="text-lg">
              <span
                style={{
                  color: streamerColor,
                }}
              >
                @
              </span>
              <span>{streamerUsername}</span>
            </p>
          </Link>
          <h1 className="text-lg lg:text-xl">{title}</h1>
          {description && (
            <div
              className="hidden text-sm lg:block"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </div>
      <AwsChatRoom
        isChatEnabled={isChatEnabled}
        streamerUsername={streamerUsername}
        userRole={userRole}
        onStreamEvent={onStreamEvent}
      />
    </div>
  );
};
