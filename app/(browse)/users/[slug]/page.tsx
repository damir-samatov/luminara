import { FC } from "react";
import { ProfileActions } from "./_components/ProfileActions";
import { getProfileData } from "@/actions/profile.actions";
import { notFound } from "next/navigation";

type CreatorPageProps = {
  params: {
    slug: string;
  };
};

const ProfilePage: FC<CreatorPageProps> = async ({ params }) => {
  const res = await getProfileData(params.slug);

  if (!res.success) return notFound();

  const { user, isBanned, isSubscribed } = res.data;

  return (
    <div>
      <p>userId: {user.id}</p>
      <p>username: {user.username}</p>
      <ProfileActions
        isSubscribed={isSubscribed}
        isBanned={isBanned}
        userId={user.id}
      />
    </div>
  );
};

export default ProfilePage;
