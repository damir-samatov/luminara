import { FC } from "react";
import { ProfileActions } from "./_components/ProfileActions";
import { getProfileData } from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import { StreamPlayer } from "@/app/(browse)/users/[slug]/_components/StreamPlayer";

type CreatorPageProps = {
  params: {
    slug: string;
  };
};

const ProfilePage: FC<CreatorPageProps> = async ({ params }) => {
  const res = await getProfileData(params.slug);

  if (!res.success) return notFound();

  const { user, isBanned, isSubscribed, stream } = res.data;

  return (
    <div>
      <p>User Id: {user.id}</p>
      <p>Username: {user.username}</p>
      <ProfileActions
        isSubscribed={isSubscribed}
        isBanned={isBanned}
        userId={user.id}
      />
      <StreamPlayer user={user} stream={stream} />
    </div>
  );
};

export default ProfilePage;
