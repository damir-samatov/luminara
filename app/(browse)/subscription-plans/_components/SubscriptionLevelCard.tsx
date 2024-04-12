import { SubscriptionLevel } from "@prisma/client";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";

type SubscriptionLevelCardProps = {
  subscriptionLevel: SubscriptionLevel & {
    imageUrl: string | null;
  };
};

export const SubscriptionLevelCard: FC<SubscriptionLevelCardProps> = ({
  subscriptionLevel,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-gray-900 p-4">
      {subscriptionLevel.imageUrl && (
        <div className="aspect-video overflow-hidden rounded">
          <Image
            src={subscriptionLevel.imageUrl}
            alt={subscriptionLevel.title}
            width={1080}
            height={1080}
          />
        </div>
      )}
      <p className="text-xl">{subscriptionLevel.title}</p>
      <p className="text-xl">{subscriptionLevel.price}$</p>
      <div
        dangerouslySetInnerHTML={{ __html: subscriptionLevel.description }}
      />
      <div className="mt-auto flex justify-end">
        <Link
          className="block max-w-max items-center gap-2 rounded-md border-2 border-transparent p-2 hover:border-gray-600"
          href={`/subscription-plans/${subscriptionLevel.id}`}
        >
          <PencilIcon className="h-6 w-6 text-gray-600" />
        </Link>
      </div>
    </div>
  );
};
