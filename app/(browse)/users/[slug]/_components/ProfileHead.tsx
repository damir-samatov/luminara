import { FC } from "react";
import { ProfileActions } from "../_components/ProfileActions";
import { classNames, stringToColor } from "@/utils/style.utils";
import Link from "next/link";
import { Subscription, SubscriptionPlan } from "@prisma/client";

type ProfileHeadProps = {
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
  subscription: Subscription | null;
  subscriptionPlans: SubscriptionPlan[];
};

export const ProfileHead: FC<ProfileHeadProps> = ({
  user,
  subscriptionPlans,
  subscription,
}) => {
  const { id, username, firstName, lastName, imageUrl } = user;
  const userColor = stringToColor(username);
  return (
    <div className="p-4">
      <div className="aspect-[6/1] w-full">
        <img
          width={1800}
          height={300}
          src={imageUrl}
          alt={username}
          className="rounded-md"
        />
      </div>
      <div className="mt-4 flex items-end gap-4">
        <div className="h-32 w-32 overflow-hidden">
          <img
            width={200}
            height={200}
            src={imageUrl}
            alt={username}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">
            <span style={{ color: userColor }}>@</span>
            {username}
          </h1>
          {(firstName || lastName) && (
            <h2 className="text-sm">
              {firstName} {lastName}
            </h2>
          )}
          {subscription && (
            <Link
              className={classNames(
                "w-full rounded-lg border-2 border-gray-700 p-2 text-center text-gray-300 transition-colors duration-200 hover:bg-gray-700"
              )}
              href={`/streams/${username}`}
            >
              View Stream
            </Link>
          )}
        </div>
        <div>
          <ProfileActions
            subscription={subscription}
            userId={id}
            subscriptionPlans={subscriptionPlans}
          />
        </div>
      </div>
    </div>
  );
};
