"use client";
import UserCard from "@/components/UserCard";
import { useBrowseNavigationContext } from "@/contexts/BrowseNavigationContext";

const SubscriptionsPage = () => {
  const { subscriptions } = useBrowseNavigationContext();

  return (
    <div className="flex flex-col gap-8 p-4">
      <h1 className="text-3xl font-bold">Subscriptions:</h1>
      <div className="flex flex-wrap gap-4">
        {subscriptions.map((subscription) => (
          <div key={subscription.user.username} className="w-60">
            <UserCard
              username={subscription.user.username}
              imageUrl={subscription.user.imageUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
