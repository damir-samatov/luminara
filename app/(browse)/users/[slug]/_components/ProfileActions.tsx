"use client";
import { FC, useState } from "react";
import {
  onChangeSubscriptionLevel,
  onSubscribe,
  onUnsubscribe,
} from "@/actions/subscription.actions";
import { useServerAction } from "@/hooks/useServerAction";
import { useBrowseNavigationContext } from "@/contexts/BrowseNavigationContext";
import { Subscription, SubscriptionLevel } from "@prisma/client";
import { Button } from "@/components/Button";

type ProfileProps = {
  subscription: Subscription | null;
  userId: string;
  subscriptionLevels: SubscriptionLevel[];
};

export const ProfileActions: FC<ProfileProps> = ({
  subscription,
  userId,
  subscriptionLevels,
}) => {
  const { refresh } = useBrowseNavigationContext();
  const [hasSubscribed, setHasSubscribed] = useState<boolean>(!!subscription);

  const [subscribe, isSubscribePending] = useServerAction(
    onSubscribe,
    (res) => {
      if (!res.success) return;
      setHasSubscribed(true);
      refresh();
    },
    console.log
  );

  const [unsubscribe, isUnsubscribePending] = useServerAction(
    onUnsubscribe,
    (res) => {
      if (!res.success) return;
      setHasSubscribed(false);
      refresh();
    },
    console.log
  );

  const onSubscriptionLevelClick = async (subscriptionLevelId: string) => {
    const res = await onChangeSubscriptionLevel(subscriptionLevelId);
    console.log({ res });
  };

  return (
    <>
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
            type="secondary"
            isDisabled={isUnsubscribePending}
            onClick={() => unsubscribe(userId)}
          >
            Unsubscribe
          </Button>
        )}
      </div>
      {hasSubscribed && (
        <div>
          {subscriptionLevels.map((subscriptionLevel) => (
            <Button
              type={
                subscriptionLevel.id === subscription?.subscriptionLevelId
                  ? "primary"
                  : "secondary"
              }
              key={subscriptionLevel.id}
              onClick={() => onSubscriptionLevelClick(subscriptionLevel.id)}
            >
              {subscriptionLevel.title} {subscriptionLevel.price}$
            </Button>
          ))}
        </div>
      )}
    </>
  );
};
