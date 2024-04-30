"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { stringToColor } from "@/utils/style.utils";
import { Button } from "@/components/Button";
import { FC } from "react";
import Image from "next/image";

type StreamBannerProps = {
  streamerUsername: string;
  streamerImageUrl: string;
  text: string;
};

export const StreamStatusBanner: FC<StreamBannerProps> = ({
  streamerUsername,
  streamerImageUrl,
  text,
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-grow flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg border-2 border-gray-700 p-6">
        <Link
          className="mx-auto flex w-full max-w-max items-end gap-2"
          href={`/users/${streamerUsername}?x=${Date.now()}`}
        >
          <Image
            className="h-12 w-12 rounded-full"
            src={streamerImageUrl}
            alt={streamerUsername}
            height={240}
            width={240}
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
          <p className="text-center text-xl">{text}</p>
        </div>
        <Button
          className="mx-auto max-w-60"
          onClick={() =>
            router.push(`/users/${streamerUsername}?x=${Date.now()}`)
          }
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};
