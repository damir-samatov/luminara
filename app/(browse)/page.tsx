import { onGetRecommendedUsers } from "@/actions/recommendation.actions";
import { notFound } from "next/navigation";
import UserCard from "@/components/UserCard";

const IndexPage = async () => {
  const res = await onGetRecommendedUsers();

  if (!res.success) return notFound();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4">
      <h2 className="text-lg font-bold md:text-2xl">Popular Creators:</h2>
      <div className="flex flex-wrap gap-4">
        {res.data.users.map((user) => (
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

export default IndexPage;
