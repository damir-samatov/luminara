import UserCard from "@/components/UserCard";
import { onGetSubscriptions } from "@/actions/subscription.actions";
import { notFound } from "next/navigation";

const SubscriptionsPage = async () => {
  const res = await onGetSubscriptions();

  if (!res.success) return notFound();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4">
      <h2 className="text-lg font-bold md:text-2xl">My Subscriptions:</h2>
      <div className="flex flex-wrap gap-4">
        {res.data.subscriptions.map(({ user }) => (
          <div key={user.username} className="w-80">
            <UserCard
              date={user.createdAt}
              username={user.username}
              imageUrl={user.imageUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
