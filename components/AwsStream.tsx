import { FC } from "react";
import { AwsStreamPlayer } from "@/components/AwsStreamPlayer";
import { AwsChatRoom } from "@/components/AwsChatRoom";
import { IvsChatRoomToken } from "@/types/ivs.types";
import Image from "next/image";
import Link from "next/link";
import { classNames, stringToColor } from "@/utils/style.utils";

type AwsStreamProps = {
  streamerImageUrl: string;
  streamerUsername: string;
  playbackUrl: string;
  thumbnailUrl: string;
  chatRoomToken: IvsChatRoomToken;
  title: string;
  description: string;
  isChatEnabled: boolean;
};

export const AwsStream: FC<AwsStreamProps> = ({
  playbackUrl,
  thumbnailUrl,
  title,
  chatRoomToken,
  description,
  streamerUsername,
  streamerImageUrl,
  isChatEnabled,
}) => {
  const streamerColor = stringToColor(streamerUsername);

  return (
    <div className="relative h-full w-full flex-grow">
      <div
        className={classNames(
          "absolute bottom-0 left-0  top-0 overflow-y-auto p-4",
          isChatEnabled ? "right-96" : "right-0"
        )}
      >
        <div className="flex flex-col gap-4">
          <AwsStreamPlayer
            playbackUrl={playbackUrl}
            thumbnailUrl={thumbnailUrl}
          />
          <Link
            className="flex w-max items-end gap-2"
            href={`/users/${streamerUsername}`}
          >
            <div className="h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={streamerImageUrl}
                alt={streamerUsername}
                height={120}
                width={120}
              />
            </div>
            <p className="text-xl">
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
          <h1 className="text-2xl">{title}</h1>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
      {isChatEnabled && (
        <div className="absolute bottom-0 right-0 top-0 w-full max-w-96 bg-gray-900 p-4">
          <AwsChatRoom chatRoomToken={chatRoomToken} />
        </div>
      )}
    </div>
  );
};
