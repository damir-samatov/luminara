"use client";
import { FC, useState } from "react";
import { onSubscribe, onUnsubscribe } from "@/actions/subscription.actions";
import Link from "next/link";
import { onBan, onUnban } from "@/actions/ban.actions";

type ProfileProps = {
  isSubscribed: boolean;
  isBanned: boolean;
  userId: string;
};

export const ProfileActions: FC<ProfileProps> = ({
  isSubscribed,
  isBanned,
  userId,
}) => {
  const [hasSubscribed, setHasSubscribed] = useState<boolean>(isSubscribed);
  const [hasBanned, setHasBanned] = useState<boolean>(isBanned);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async () => {
    try {
      const res = await onSubscribe(userId);
      if (res.success) return setHasSubscribed(true);
      setError(res.message);
    } catch {
      setError("Something went wrong");
    }
  };

  const unsubscribe = async () => {
    try {
      const res = await onUnsubscribe(userId);
      if (res.success) return setHasSubscribed(false);
      setError(res.message);
    } catch {
      setError("Something went wrong");
    }
  };

  const ban = async () => {
    try {
      const res = await onBan(userId);
      if (res.success) return setHasBanned(true);
      setError(res.message);
    } catch {
      setError("Something went wrong");
    }
  };

  const unban = async () => {
    try {
      const res = await onUnban(userId);
      if (res.success) return setHasBanned(false);
      setError(res.message);
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div>
      <div>
        <Link href="/">Home</Link>
      </div>
      {hasSubscribed ? (
        <button onClick={unsubscribe}>Unsubscribe</button>
      ) : (
        <button onClick={subscribe}>Subscribe</button>
      )}
      {hasBanned ? (
        <button onClick={unban}>Unban</button>
      ) : (
        <button onClick={ban}>Ban</button>
      )}
      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
};
