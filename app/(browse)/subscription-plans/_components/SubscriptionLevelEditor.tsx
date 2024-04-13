"use client";
import { FC } from "react";
import Link from "next/link";
import { SubscriptionLevel } from "@prisma/client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { SubscriptionLevelImageEditor } from "../_components/SubscriptionLevelImageEditor";
import { SubscriptionLevelContentEditor } from "../_components/SubscriptionLevelContentEditor";
import { SubscriptionLevelDeleterModal } from "../_components/SubscriptionLevelDeleterModal";

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
      <div className="flex items-center gap-2">
        <Link
          href="/subscription-plans"
          className="block rounded border-2 border-transparent px-6 py-2 text-gray-300 hover:border-gray-700"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h2 className="text-3xl">
          Subscription Plan Editor - {subscriptionLevel.price}$
        </h2>
        <div className="ml-auto">
          <SubscriptionLevelDeleterModal
            subscriptionLevelId={subscriptionLevel.id}
          />
        </div>
      </div>
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
