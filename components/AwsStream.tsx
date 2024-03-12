"use client";
import { FC } from "react";
import { AwsStreamPlayer } from "@/components/AwsStreamPlayer";
import { AwsChatRoom } from "@/components/AwsChatRoom";
import Image from "next/image";
import Link from "next/link";
import { classNames, stringToColor } from "@/utils/style.utils";

type AwsStreamProps = {
  streamerImageUrl: string;
  streamerUsername: string;
  playbackUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  isChatEnabled: boolean;
  isModerator?: boolean;
};

export const AwsStream: FC<AwsStreamProps> = ({
  playbackUrl,
  thumbnailUrl,
  title,
  description,
  streamerUsername,
  streamerImageUrl,
  isChatEnabled,
  isModerator = false,
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
        />
        <div className="mt-4 flex flex-col gap-2">
          <Link
            className="flex w-max items-end gap-2"
            href={`/users/${streamerUsername}`}
          >
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={streamerImageUrl}
                alt={streamerUsername}
                height={120}
                width={120}
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
      {isChatEnabled && (
        <div className="absolute bottom-0 right-0 h-72 w-full bg-gray-900 p-4 lg:top-0 lg:h-auto lg:max-w-96">
          <AwsChatRoom
            streamerUsername={streamerUsername}
            isModerator={isModerator}
          />
        </div>
      )}
    </div>
  );
};
