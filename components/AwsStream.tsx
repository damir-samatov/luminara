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
    <div className="relative h-full w-full flex-grow">
      <div
        className={classNames(
          "overflow-x-hidden p-4 lg:absolute lg:bottom-0 lg:left-0 lg:top-0 lg:overflow-y-auto",
          isChatEnabled ? "right-96" : "right-0"
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
        <div className="h-[300px] w-full bg-gray-900 p-4 lg:absolute lg:bottom-0 lg:right-0 lg:top-0 lg:h-auto lg:max-w-96">
          <AwsChatRoom
            streamerUsername={streamerUsername}
            isModerator={isModerator}
          />
        </div>
      )}
    </div>
  );
};
