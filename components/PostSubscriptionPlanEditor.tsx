"use client";
import { useBrowseNavigationContext } from "@/contexts/BrowseNavigationContext";
import { FC, useCallback, useState } from "react";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { onUpdatePostSubscriptionPlan } from "@/actions/post.actions";
import { toast } from "react-toastify";
import { SubscriptionPlanSelector } from "@/components/SubscriptionPlanSelector";

type PostSubscriptionPlanEditorProps = {
  subscriptionPlanId: string | null;
  postId: string;
  subscriptionPlans: SubscriptionPlanDto[];
};

export const PostSubscriptionPlanEditor: FC<
  PostSubscriptionPlanEditorProps
> = ({ subscriptionPlanId, postId, subscriptionPlans }) => {
  const { self } = useBrowseNavigationContext();

  const [activeSubscriptionPlan, setActiveSubscriptionPlan] =
    useState<SubscriptionPlanDto | null>(
      () =>
        subscriptionPlans.find((plan) => plan.id === subscriptionPlanId) || null
    );

  const onSubscriptionPlanChange = useCallback(
    async (subscriptionPlanDto: SubscriptionPlanDto | null) => {
      let prevSubscriptionPlan: SubscriptionPlanDto | null = null;

      setActiveSubscriptionPlan((prev) => {
        prevSubscriptionPlan = prev;
        return subscriptionPlanDto;
      });

      try {
        const res = await onUpdatePostSubscriptionPlan({
          postId,
          subscriptionPlanId: subscriptionPlanDto?.id || null,
        });

        if (res.success) {
          toast("Subscription plan successfully updated", {
            type: "success",
          });
        } else {
          setActiveSubscriptionPlan(prevSubscriptionPlan);
          toast("Failed to update the subscription plan", {
            type: "error",
          });
        }
      } catch (error) {
        toast("Failed to update the subscription plan", { type: "error" });
        console.error(error);
        setActiveSubscriptionPlan(prevSubscriptionPlan);
      }
    },
    [postId]
  );
  return (
    <SubscriptionPlanSelector
      freeFollowerImageUrl={self.imageUrl}
      subscriptionPlans={subscriptionPlans}
      activeSubscriptionPlan={activeSubscriptionPlan}
      onChange={onSubscriptionPlanChange}
    />
  );
};
