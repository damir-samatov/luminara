import { SubscriptionPlan } from "@prisma/client";
import { FC } from "react";
import Link from "next/link";
import { SubscriptionPlanDeleterModal } from "./SubscriptionPlanDeleterModal";
import { PencilIcon } from "@heroicons/react/24/outline";

type SubscriptionPlanCardProps = {
  subscriptionPlan: SubscriptionPlan & {
    imageUrl: string | null;
  };
};

export const SubscriptionPlanCard: FC<SubscriptionPlanCardProps> = ({
  subscriptionPlan,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4 rounded-lg bg-gray-900 p-4">
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
          dangerouslySetInnerHTML={{ __html: subscriptionPlan.description }}
        />
        <div className="ml-auto mt-auto grid grid-cols-2 gap-2">
          <Link
            href={`/subscription-plans/${subscriptionPlan.id}`}
            className="ml-auto flex w-full items-center justify-center gap-2 rounded border-2 border-gray-700 bg-transparent px-2 py-2 text-center text-xs font-semibold text-gray-100 hover:border-gray-600 hover:bg-gray-600 md:px-4 md:text-sm"
          >
            <PencilIcon className="h-3 w-3" />
            <span>Edit</span>
          </Link>
          <SubscriptionPlanDeleterModal
            subscriptionPlanId={subscriptionPlan.id}
          />
        </div>
      </div>
    </div>
  );
};
