"use client";
import { FC } from "react";
import { SubscriptionLevel } from "@prisma/client";
import { SubscriptionLevelImageEditor } from "@/app/(browse)/subscription-levels/_components/SubscriptionLevelImageEditor";
import { SubscriptionLevelContentEditor } from "@/app/(browse)/subscription-levels/_components/SubscriptionLevelContentEditor";

type SubscriptionLevelEditorProps = {
  subscriptionLevel: SubscriptionLevel & {
    imageUrl: string | null;
  };
};

export const SubscriptionLevelEditor: FC<SubscriptionLevelEditorProps> = ({
  subscriptionLevel,
}) => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-6">
      <h2 className="text-3xl">
        {subscriptionLevel.price.toFixed(2)}$ - Subscription Plan Editor
      </h2>
      <SubscriptionLevelImageEditor
        subscriptionLevelId={subscriptionLevel.id}
        initialImageUrl={subscriptionLevel.imageUrl}
      />
      <SubscriptionLevelContentEditor
        subscriptionLevelId={subscriptionLevel.id}
        initialDescription={subscriptionLevel.description}
        initialTitle={subscriptionLevel.title}
      />
    </div>
  );
};
