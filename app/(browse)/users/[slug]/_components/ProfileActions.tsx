"use client";
import { FC, useState } from "react";
import {
  onChangeSubscriptionLevel,
  onSubscribe,
  onUnsubscribe,
} from "@/actions/subscription.actions";
import { useServerAction } from "@/hooks/useServerAction";
import { useBrowseNavigationContext } from "@/contexts/BrowseNavigationContext";
import { Button } from "@/components/Button";
import { Subscription, SubscriptionLevel } from "@prisma/client";
import { classNames } from "@/utils/style.utils";

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
    <div>
      <div>
        {!hasSubscribed ? (
          <Button
            isDisabled={isSubscribePending}
            isLoading={isSubscribePending}
            loadingText="Subscribing..."
            onClick={() => subscribe(userId)}
          >
            Subscribe
          </Button>
        ) : (
          <Button
            isDisabled={isUnsubscribePending}
            isLoading={isUnsubscribePending}
            loadingText="Unsubscribing..."
            onClick={() => unsubscribe(userId)}
          >
            Unsubscribe
          </Button>
        )}
      </div>

      {hasSubscribed &&
        subscriptionLevels.map((subscriptionLevel) => (
          <button
            className={classNames(
              "w-full rounded-lg border-2 border-gray-700 p-2 text-gray-300 transition-colors duration-200 hover:bg-gray-700",
              subscriptionLevel.id === subscription?.subscriptionLevelId &&
                "bg-gray-700"
            )}
            key={subscriptionLevel.id}
            onClick={() => onSubscriptionLevelClick(subscriptionLevel.id)}
          >
            {subscriptionLevel.title} {subscriptionLevel.price}$
          </button>
        ))}
    </div>
  );
};
