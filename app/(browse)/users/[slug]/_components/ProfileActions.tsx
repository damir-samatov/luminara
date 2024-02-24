"use client";
import { FC, useState } from "react";
import { onSubscribe, onUnsubscribe } from "@/actions/subscription.actions";
import { useServerAction } from "@/hooks/useServerAction";
import { useBrowseNavigationContext } from "@/contexts/BrowseNavigationContext";
import { Button } from "@/components/Button";
import Link from "next/link";

type ProfileProps = {
  isSubscribed: boolean;
  userId: string;
};

export const ProfileActions: FC<ProfileProps> = ({ isSubscribed, userId }) => {
  const { refresh } = useBrowseNavigationContext();
  const [hasSubscribed, setHasSubscribed] = useState<boolean>(isSubscribed);
  const [error, setError] = useState<string | null>(null);

  const [subscribe, isSubscribePending] = useServerAction(
    onSubscribe,
    (res) => {
      if (res.success) {
        setHasSubscribed(true);
        refresh();
      } else setError(res.message);
    },
    () => setError("Failed to subscribe")
  );

  const [unsubscribe, isUnsubscribePending] = useServerAction(
    onUnsubscribe,
    (res) => {
      if (res.success) {
        setHasSubscribed(false);
        refresh();
      } else setError(res.message);
    },
    () => setError("Failed to unsubscribe")
  );

  return (
    <div>
      <div>
        {!hasSubscribed ? (
          <Button
            isDisabled={isSubscribePending}
            onClick={() => subscribe(userId)}
          >
            Subscribe
          </Button>
        ) : (
          <Button
            isDisabled={isUnsubscribePending}
            onClick={() => unsubscribe(userId)}
          >
            Unsubscribe
          </Button>
        )}
      </div>
      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
};
