"use client";
import { FC, useMemo, useState } from "react";
import { SubscriptionPlan } from "@prisma/client";
import { SubscriptionPlanImageEditor } from "../_components/SubscriptionPlanImageEditor";
import { SubscriptionPlanContentEditor } from "../_components/SubscriptionPlanContentEditor";
import { SubscriptionPlanDeleterModal } from "../_components/SubscriptionPlanDeleterModal";
import { Button } from "@/components/Button";
import { BackButton } from "@/components/BackButton";

type SubscriptionPlanEditorProps = {
  subscriptionPlan: SubscriptionPlan & {
    imageUrl: string;
  };
};

export const SubscriptionPlanEditor: FC<SubscriptionPlanEditorProps> = ({
  subscriptionPlan,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = useMemo(
    () => [
      {
        component: (
          <SubscriptionPlanContentEditor
            subscriptionPlanId={subscriptionPlan.id}
            initialDescription={subscriptionPlan.description}
            initialTitle={subscriptionPlan.title}
          />
        ),
        label: "Content",
      },
      {
        component: (
          <SubscriptionPlanImageEditor
            subscriptionPlanId={subscriptionPlan.id}
            initialImageUrl={subscriptionPlan.imageUrl}
          />
        ),
        label: "Cover Image",
      },
    ],
    [
      subscriptionPlan.id,
      subscriptionPlan.imageUrl,
      subscriptionPlan.description,
      subscriptionPlan.title,
    ]
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-2 lg:p-6">
      <div className="flex items-center gap-2">
        <BackButton href="/subscription-plans" />
        <h2 className="text-sm md:text-xl lg:text-3xl">
          Subscription Plan - {subscriptionPlan.price}$
        </h2>
        <div className="ml-auto">
          <SubscriptionPlanDeleterModal
            subscriptionPlanId={subscriptionPlan.id}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:gap-4">
        {tabs.map((tab, i) => (
          <Button
            type={activeTab === i ? "primary" : "secondary"}
            onClick={() => setActiveTab(i)}
            key={tab.label}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      {tabs[activeTab]?.component}
    </div>
  );
};
