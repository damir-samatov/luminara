import { SubscriptionLevel } from "@prisma/client";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

type SubscriptionLevelCardProps = {
  subscriptionLevel: SubscriptionLevel & {
    imageUrl: string | null;
  };
};

export const SubscriptionLevelCard: FC<SubscriptionLevelCardProps> = ({
  subscriptionLevel,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4 rounded-lg bg-gray-900 p-4">
      {subscriptionLevel.imageUrl && (
        <div className="col-span-1 aspect-square overflow-hidden rounded">
          <Image
            src={subscriptionLevel.imageUrl}
            alt={subscriptionLevel.title}
            width={640}
            height={640}
            className="rounded-lg object-contain"
            loading="eager"
          />
        </div>
      )}
      <div className="col-span-3 flex flex-col gap-4">
        <p className="text-xl">{subscriptionLevel.title}</p>
        <p className="text-xl">{subscriptionLevel.price}$</p>
        <div
          dangerouslySetInnerHTML={{ __html: subscriptionLevel.description }}
        />
        <div className="mt-auto flex justify-end">
          <Link
            href={`/subscription-plans/${subscriptionLevel.id}`}
            className="ml-auto w-full max-w-max rounded border-2 border-gray-700 bg-transparent px-2 py-2 text-center text-xs font-semibold text-gray-100 hover:border-gray-600 hover:bg-gray-600 md:px-4 md:text-sm"
          >
            <span>Edit</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
