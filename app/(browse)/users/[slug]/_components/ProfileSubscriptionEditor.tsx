import { FC, useCallback, useState } from "react";
import {
  onChangeSubscriptionPlan,
  onSubscribe,
  onUnsubscribe,
} from "@/actions/subscription.actions";
import { Subscription } from "@prisma/client";
import { Button } from "@/components/Button";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

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
  const { self, setSubscriptions } = useGlobalContext();
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
      setSubscriptions((prev) => [...prev, res.data.subscription]);
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
      setSubscriptions((prev) => prev.filter((sub) => sub.userId !== userId));
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

  const isSelf = self.id === userId;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      {!isSelf && (
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          className="mx-auto w-full max-w-80"
          loadingText="Subscribing..."
          onClick={isSubscribed ? onUnsubscribeClick : onSubscribeClick}
        >
          {isSubscribed ? `Unfollow @${username}` : `Follow @${username}`}
        </Button>
      )}
      {(isSubscribed || isSelf) && (
        <>
          <div className="grid grid-cols-4 gap-4 rounded-lg bg-gray-900 p-4">
            <div className="col-span-1 aspect-square overflow-hidden rounded">
              <img
                src={imageUrl}
                alt="Follower"
                width={640}
                height={640}
                className="rounded-lg object-contain"
                loading="eager"
              />
            </div>
            <div className="col-span-3 flex flex-col gap-4">
              <p className="text-xl">Follower</p>
              <p className="text-xl">Free</p>
              {!isSelf && (
                <div className="ml-auto mt-auto">
                  {!activeSubscriptionPlan ? (
                    <p className="font-semibold text-gray-200">Active Plan</p>
                  ) : (
                    <Button
                      isLoading={isLoading}
                      isDisabled={isLoading}
                      type="secondary"
                      onClick={() => onSubscriptionPlanChange(null)}
                    >
                      Downgrade Plan
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          {subscriptionPlans
            .sort((a, b) => a.price - b.price)
            .map((subscriptionPlan) => (
              <div
                key={subscriptionPlan.id}
                className="grid grid-cols-4 gap-4 rounded-lg bg-gray-900 p-4"
              >
                {subscriptionPlan.imageUrl && (
                  <div className="col-span-1 aspect-square overflow-hidden rounded">
                    <img
                      src={subscriptionPlan.imageUrl}
                      alt={subscriptionPlan.title}
                      width={640}
                      height={640}
                      className="rounded-lg object-contain"
                      loading="eager"
                    />
                  </div>
                )}
                <div className="col-span-3 flex flex-col gap-4">
                  <p className="text-xl">{subscriptionPlan.title}</p>
                  <p className="text-xl">{subscriptionPlan.price}$</p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: subscriptionPlan.description,
                    }}
                  />
                  {isSelf ? (
                    <div className="ml-auto mt-auto">
                      <Link
                        href={`/subscription-plans/${
                          subscriptionPlan.id
                        }?x=${Date.now()}`}
                        className="ml-auto flex w-full items-center justify-center gap-2 rounded border-2 border-gray-700 bg-transparent px-2 py-2 text-center text-xs font-semibold text-gray-100 hover:border-gray-600 hover:bg-gray-600 md:px-4 md:text-sm"
                      >
                        <PencilIcon className="h-3 w-3" />
                        <span>Edit</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="ml-auto mt-auto">
                      {activeSubscriptionPlan &&
                      activeSubscriptionPlan.id === subscriptionPlan.id ? (
                        <p className="font-semibold text-gray-200">
                          Active Plan
                        </p>
                      ) : (
                        <Button
                          isLoading={isLoading}
                          isDisabled={isLoading}
                          type="secondary"
                          onClick={() =>
                            onSubscriptionPlanChange(subscriptionPlan)
                          }
                        >
                          {subscriptionPlan.price >
                          (activeSubscriptionPlan?.price || 0)
                            ? "Upgrade Plan"
                            : "Downgrade Plan"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};
