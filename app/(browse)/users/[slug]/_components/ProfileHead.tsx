"use client";
import { FC, useCallback, useMemo } from "react";
import { classNames, stringToColor } from "@/utils/style.utils";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { self } = useGlobalContext();

  const image = useMemo(
    () => (
      <img
        width={200}
        height={200}
        src={avatarUrl}
        alt={username}
        className={classNames(
          "h-20 w-20 rounded-full border-4 md:h-28 md:w-28",
          isLive ? "border-red-700" : "border-transparent"
        )}
      />
    ),
    [avatarUrl, isLive, username]
  );

  const onStreamViewClick = useCallback(() => {
    router.push(`/users/${username}/stream?x=${Date.now()}`);
  }, [router, username]);

  return (
    <div className="flex items-end gap-4">
      {isLive ? <button onClick={onStreamViewClick}>{image}</button> : image}
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
            <button
              onClick={onStreamViewClick}
              className="rounded-lg bg-red-700 px-2 py-1 text-sm font-semibold"
            >
              LIVE
            </button>
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
