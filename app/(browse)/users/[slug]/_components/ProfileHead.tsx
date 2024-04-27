"use client";
import { FC, useMemo } from "react";
import { classNames, stringToColor } from "@/utils/style.utils";
import Link from "next/link";
import { useGlobalContext } from "@/contexts/GlobalContext";

type ProfileHeadProps = {
  isLive: boolean;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  posterUrl: string;
};

export const ProfileHead: FC<ProfileHeadProps> = ({
  isLive,
  userId,
  username,
  firstName,
  lastName,
  avatarUrl,
}) => {
  const { self } = useGlobalContext();

  const image = useMemo(
    () => (
      <img
        width={200}
        height={200}
        src={avatarUrl}
        alt={username}
        className={classNames(
          "h-24 w-24 rounded-full border-4 md:h-32 md:w-32",
          isLive ? "border-red-700" : "border-transparent"
        )}
      />
    ),
    [avatarUrl, isLive, username]
  );

  return (
    <div className="flex items-end gap-4 p-4">
      {isLive ? <Link href={`/streams/${username}`}>{image}</Link> : image}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl">
            <span style={{ color: stringToColor(username) }}>@</span>
            {username}
          </h1>
          {self.id === userId && (
            <p className="rounded-lg bg-blue-900 px-2 py-1 text-sm font-semibold">
              YOU
            </p>
          )}
          {isLive && (
            <Link
              href={`/streams/${username}`}
              className="rounded-lg bg-red-700 px-2 py-1 text-sm font-semibold"
            >
              LIVE
            </Link>
          )}
        </div>
        {(firstName || lastName) && (
          <h2 className="text-sm">
            {firstName} {lastName}
          </h2>
        )}
      </div>
    </div>
  );
};
