import { FC } from "react";
import { getUserByUsername } from "@/services/user.service";
import { notFound } from "next/navigation";
import { getSubscription } from "@/services/subscription.service";
import { getSelf } from "@/services/auth.service";
import { ProfileActions } from "@/app/[slug]/_components/ProfileActions";

type CreatorPageProps = {
  params: {
    slug: string;
  };
};

const ProfilePage: FC<CreatorPageProps> = async ({ params }) => {
  const user = await getUserByUsername(params.slug);

  if (!user) return notFound();

  let self = null;

  try {
    self = await getSelf();
  } catch {
    return notFound();
  }

  const subscription = await getSubscription(self.id, user.id);

  return (
    <div>
      <p>userId: {user.id}</p>
      <p>username: {user.username}</p>
      <ProfileActions isSubscribed={!!subscription} userId={user.id} />
    </div>
  );
};

export default ProfilePage;
