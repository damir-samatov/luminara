import { onGetSelfSubscriptionLevels } from "@/actions/subscription-level.actions";
import { notFound } from "next/navigation";
import { SubscriptionLevelCard } from "@/app/(browse)/subscription-levels/_components/SubscriptionLevelCard";
import { classNames } from "@/utils/style.utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const SubscriptionLevelsPage = async () => {
  const res = await onGetSelfSubscriptionLevels();

  if (!res.success) return notFound();

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-4">
        {res.data.subscriptionLevels.map((subscriptionLevel) => (
          <SubscriptionLevelCard
            key={subscriptionLevel.id}
            subscriptionLevel={subscriptionLevel}
          />
        ))}
      </div>
      <Link
        href="/subscription-levels/new"
        className={classNames(
          "mt-4 flex max-w-max items-center gap-2 rounded-md bg-gray-800 p-4 text-sm font-semibold leading-6 text-gray-100"
        )}
      >
        <PencilIcon className="h-6 w-6" />
        <span>New Subscription Level</span>
      </Link>
    </div>
  );
};

export default SubscriptionLevelsPage;
