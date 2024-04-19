"use client";
import { FC, useState } from "react";
import {
  onChangeSubscriptionPlan,
  onSubscribe,
  onUnsubscribe,
} from "@/actions/subscription.actions";
import { useServerAction } from "@/hooks/useServerAction";
import { useBrowseNavigationContext } from "@/contexts/BrowseNavigationContext";
import { Subscription, SubscriptionPlan } from "@prisma/client";
import { Button } from "@/components/Button";

type ProfileProps = {
  subscription: Subscription | null;
  userId: string;
  subscriptionPlans: SubscriptionPlan[];
};

export const ProfileActions: FC<ProfileProps> = ({
  subscription,
  userId,
  subscriptionPlans,
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

  const onSubscriptionPlanClick = async (subscriptionPlanId: string) => {
    const res = await onChangeSubscriptionPlan(subscriptionPlanId);
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
          {subscriptionPlans.map((subscriptionPlan) => (
            <Button
              type={
                subscriptionPlan.id === subscription?.subscriptionPlanId
                  ? "primary"
                  : "secondary"
              }
              key={subscriptionPlan.id}
              onClick={() => onSubscriptionPlanClick(subscriptionPlan.id)}
            >
              {subscriptionPlan.title} {subscriptionPlan.price}$
            </Button>
          ))}
        </div>
      )}
    </>
  );
};
