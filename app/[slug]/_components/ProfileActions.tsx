"use client";
import { FC, useState } from "react";
import { onSubscribe, onUnsubscribe } from "@/actions/subscription.actions";
import Link from "next/link";

type ProfileProps = {
  isSubscribed: boolean;
  userId: string;
};

export const ProfileActions: FC<ProfileProps> = ({ isSubscribed, userId }) => {
  const [hasSubscribed, setHasSubscribed] = useState<boolean>(isSubscribed);
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
      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
};
