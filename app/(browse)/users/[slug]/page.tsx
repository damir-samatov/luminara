import { FC } from "react";
import { getProfileData } from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import { ProfileHead } from "@/app/(browse)/users/[slug]/_components/ProfileHead";

type ProfilePageProps = {
  params: {
    slug: string;
  };
};

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
  const res = await getProfileData(params.slug);

  if (!res.success) return notFound();

  const { user, isSelfSubscribed } = res.data;

  return (
    <ProfileHead
      user={{
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        imageUrl: user.imageUrl,
        isSelfSubscribed: isSelfSubscribed,
      }}
    />
  );
};

export default ProfilePage;
