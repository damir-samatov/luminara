"use client";
import { FC, useMemo, useState } from "react";
import { SubscriptionLevel } from "@prisma/client";
import { SubscriptionLevelImageEditor } from "../_components/SubscriptionLevelImageEditor";
import { SubscriptionLevelContentEditor } from "../_components/SubscriptionLevelContentEditor";
import { SubscriptionLevelDeleterModal } from "../_components/SubscriptionLevelDeleterModal";
import { Button } from "@/components/Button";
import { BackButton } from "@/components/BackButton";

type SubscriptionLevelEditorProps = {
  subscriptionLevel: SubscriptionLevel & {
    imageUrl: string | null;
  };
};

export const SubscriptionLevelEditor: FC<SubscriptionLevelEditorProps> = ({
  subscriptionLevel,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = useMemo(
    () => [
      {
        component: (
          <SubscriptionLevelContentEditor
            subscriptionLevelId={subscriptionLevel.id}
            initialDescription={subscriptionLevel.description}
            initialTitle={subscriptionLevel.title}
          />
        ),
        label: "Content",
      },
      {
        component: (
          <SubscriptionLevelImageEditor
            subscriptionLevelId={subscriptionLevel.id}
            initialImageUrl={subscriptionLevel.imageUrl}
          />
        ),
        label: "Cover Image",
      },
    ],
    [
      subscriptionLevel.id,
      subscriptionLevel.imageUrl,
      subscriptionLevel.description,
      subscriptionLevel.title,
    ]
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-2 lg:p-6">
      <div className="flex items-center gap-2">
        <BackButton href="/subscription-plans" />
        <h2 className="text-sm md:text-xl lg:text-3xl">
          Subscription Plan - {subscriptionLevel.price}$
        </h2>
        <div className="ml-auto">
          <SubscriptionLevelDeleterModal
            subscriptionLevelId={subscriptionLevel.id}
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
