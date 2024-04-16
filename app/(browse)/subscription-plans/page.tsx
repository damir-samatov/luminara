import { onGetSelfSubscriptionLevels } from "@/actions/subscription-level.actions";
import { notFound } from "next/navigation";
import { SubscriptionLevelCard } from "./_components/SubscriptionLevelCard";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const SubscriptionLevelsPage = async () => {
  const res = await onGetSelfSubscriptionLevels();
  if (!res.success) return notFound();
  return (
    <>
      <title>Subscription Plans</title>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm md:text-xl lg:text-3xl">Subscription Plans</h2>
          <Link
            href="/subscription-plans/new"
            className="ml-auto flex w-full max-w-max items-center gap-1 rounded border-2 border-gray-700 bg-transparent px-2 py-2 text-center text-xs font-semibold text-gray-100 hover:border-gray-600 hover:bg-gray-600 md:px-4 md:text-sm"
          >
            <span>Create New</span>
            <PlusIcon className="mx-auto h-3 w-3" />
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {res.data.subscriptionLevels.map((subscriptionLevel) => (
            <SubscriptionLevelCard
              key={subscriptionLevel.id}
              subscriptionLevel={subscriptionLevel}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SubscriptionLevelsPage;
