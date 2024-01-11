import { FC } from "react";
import { getUserByUsername } from "@/services/user.service";
import { notFound } from "next/navigation";
import { getSubscription } from "@/services/subscription.service";
import { getSelf } from "@/services/auth.service";
import { Profile } from "@/app/[slug]/_components/Profile";

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

  const subscription = await getSubscription(user.id, self.id);

  return <Profile user={user} isSubscribed={!!subscription} />;
};

export default ProfilePage;
