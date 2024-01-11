"use client";

import { User } from ".prisma/client";
import { FC, useState } from "react";
import { onSubscribe, onUnsubscribe } from "@/actions/subscription.actions";

type ProfileProps = {
  user: User;
  isSubscribed: boolean;
};

export const Profile: FC<ProfileProps> = ({ user, isSubscribed }) => {
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async () => {
    try {
      const res = await onSubscribe(user.id);

      if (res.success) {
        setHasSubscribed(true);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Something went wrong");
    }
  };

  const unsubscribe = async () => {
    try {
      const res = await onUnsubscribe(user.id);

      if (res.success) {
        setHasSubscribed(false);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <div>id userId: {user.id}</div>
      <div>externalUserId: {user.externalUserId}</div>
      <div>username: {user.username}</div>
      {hasSubscribed ? (
        <button onClick={unsubscribe}>Unsubscribe</button>
      ) : (
        <button onClick={subscribe}>Subscribe</button>
      )}
    </div>
  );
};
