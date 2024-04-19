import { FC } from "react";
import { onGetProfileData } from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import { ProfileHead } from "./_components/ProfileHead";

type ProfilePageProps = {
  params: {
    slug: string;
  };
};

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
  const res = await onGetProfileData(params.slug);

  if (!res.success) return notFound();

  const { user, subscriptionPlans, subscription } = res.data;

  return (
    <div>
      <ProfileHead
        user={{
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          imageUrl: user.imageUrl,
        }}
        subscription={subscription}
        subscriptionPlans={subscriptionPlans}
      />
    </div>
  );
};

export default ProfilePage;
