import { SubscriptionLevel } from "@prisma/client";
import { FC } from "react";
import Image from "next/image";

type SubscriptionLevelCardProps = {
  subscriptionLevel: SubscriptionLevel & {
    imageUrl: string | null;
  };
};

export const SubscriptionLevelCard: FC<SubscriptionLevelCardProps> = ({
  subscriptionLevel,
}) => {
  return (
    <div className="rounded-lg bg-gray-900 p-4">
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
      <div className="mt-4 flex flex-col gap-4">
        <p className="text-xl">{subscriptionLevel.title}</p>
        <p className="text-xl">{subscriptionLevel.price}$</p>
        <div
          dangerouslySetInnerHTML={{ __html: subscriptionLevel.description }}
        />
      </div>
    </div>
  );
};
