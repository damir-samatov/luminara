"use client";
import { FC, useState } from "react";
import { onSubscribe, onUnsubscribe } from "@/actions/subscription.actions";
import { onBan, onUnban } from "@/actions/ban.actions";
import { useServerAction } from "@/hooks/useServerAction";

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

  const [subscribe, isSubscribePending] = useServerAction(
    onSubscribe,
    (res) => {
      if (res.success) setHasSubscribed(true);
      else setError(res.message);
    },
    () => setError("Failed to subscribe")
  );

  const [unsubscribe, isUnsubscribePending] = useServerAction(
    onUnsubscribe,
    (res) => {
      if (res.success) setHasSubscribed(false);
      else setError(res.message);
    },
    () => setError("Failed to unsubscribe")
  );

  const [ban, isBanPending] = useServerAction(
    onBan,
    (res) => {
      if (res.success) setHasBanned(true);
      else setError(res.message);
    },
    () => setError("Failed to ban")
  );

  const [unban, isUnbanPending] = useServerAction(
    onUnban,
    (res) => {
      if (res.success) setHasBanned(false);
      else setError(res.message);
    },
    () => setError("Failed to unban")
  );

  return (
    <div>
      <div>
        {!hasSubscribed ? (
          <button
            disabled={isSubscribePending}
            onClick={() => subscribe(userId)}
          >
            Subscribe
          </button>
        ) : (
          <button
            disabled={isUnsubscribePending}
            onClick={() => unsubscribe(userId)}
          >
            Unsubscribe
          </button>
        )}
      </div>
      <div>
        {!hasBanned ? (
          <button disabled={isBanPending} onClick={() => ban(userId)}>
            Ban
          </button>
        ) : (
          <button disabled={isUnbanPending} onClick={() => unban(userId)}>
            Unban
          </button>
        )}
      </div>
      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
};
