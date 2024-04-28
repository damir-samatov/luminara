import { FC, useCallback, useState } from "react";
import {
  onChangeSubscriptionPlan,
  onSubscribe,
  onUnsubscribe,
} from "@/actions/subscription.actions";
import { Subscription } from "@prisma/client";
import { Button } from "@/components/Button";
import { SubscriptionPlanSelector } from "@/components/SubscriptionPlanSelector";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { toast } from "react-toastify";

type ProfileSubscriptionPLanProps = {
  userId: string;
  imageUrl: string;
  username: string;
  subscription: Subscription | null;
  subscriptionPlans: SubscriptionPlanDto[];
  onSubscriptionChanged: (subscription: Subscription | null) => void;
};

export const ProfileSubscriptionEditor: FC<ProfileSubscriptionPLanProps> = ({
  userId,
  imageUrl,
  username,
  subscription,
  subscriptionPlans,
  onSubscriptionChanged,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(!!subscription);
  const [activeSubscriptionPlan, setActiveSubscriptionPlan] = useState(
    () =>
      subscriptionPlans.find(
        (subscriptionPlan) =>
          subscriptionPlan.id === subscription?.subscriptionPlanId
      ) || null
  );

  const onSubscribeClick = async () => {
    try {
      if (isLoading) return;
      const res = await onSubscribe(userId);
      if (!res.success) return toast(res.message, { type: "error" });
      toast(`Subscribed to @${username}`, { type: "success" });
      setIsSubscribed(true);
      onSubscriptionChanged(res.data.subscription);
    } catch (error) {
      console.error(error);
      toast("Something went wrong", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const onUnsubscribeClick = async () => {
    try {
      if (isLoading) return;
      const res = await onUnsubscribe(userId);
      if (!res.success) return toast(res.message, { type: "error" });
      toast(`Unsubscribed from @${username}`, { type: "success" });
      setIsSubscribed(false);
      onSubscriptionChanged(null);
    } catch (error) {
      console.error(error);
      toast("Something went wrong", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubscriptionPlanChange = useCallback(
    async (subscriptionPlanDto: SubscriptionPlanDto | null) => {
      if (!subscription) return;

      let prevSubscriptionPlan: SubscriptionPlanDto | null = null;

      setActiveSubscriptionPlan((prev) => {
        prevSubscriptionPlan = prev;
        return subscriptionPlanDto;
      });

      try {
        const res = await onChangeSubscriptionPlan({
          subscriptionId: subscription.id,
          subscriptionPlanId: subscriptionPlanDto?.id || null,
        });

        if (res.success) {
          toast("Subscription plan successfully updated", {
            type: "success",
          });
          onSubscriptionChanged(res.data.subscription);
        } else {
          toast("Failed to update the subscription plan", {
            type: "error",
          });
          setActiveSubscriptionPlan(prevSubscriptionPlan);
        }
      } catch (error) {
        toast("Failed to update the subscription plan", { type: "error" });
        console.error(error);
        setActiveSubscriptionPlan(prevSubscriptionPlan);
      }
    },
    [subscription, onSubscriptionChanged]
  );

  return (
    <div className="mx-auto flex max-w-52 flex-col gap-4">
      {isSubscribed && (
        <SubscriptionPlanSelector
          freeFollowerImageUrl={imageUrl}
          subscriptionPlans={subscriptionPlans}
          activeSubscriptionPlan={activeSubscriptionPlan}
          onChange={onSubscriptionPlanChange}
        />
      )}
      {!isSubscribed ? (
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          loadingText="Subscribing..."
          onClick={onSubscribeClick}
        >
          Subscribe
        </Button>
      ) : (
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          loadingText="Unsubscribing..."
          onClick={onUnsubscribeClick}
        >
          Unsubscribe
        </Button>
      )}
    </div>
  );
};
