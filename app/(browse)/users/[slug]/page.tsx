import { FC } from "react";
import { onGetProfileData } from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import { ProfileHead } from "./_components/ProfileHead";
import { onGetBlogPostsByUsername } from "@/actions/blog-post-viewer.actions";
import { onGetVideoPostsByUsername } from "@/actions/video-post-viewer.actions";
import { ProfileActions } from "@/app/(browse)/users/[slug]/_components/ProfileActions";

type ProfilePageProps = {
  params: {
    slug: string;
  };
};

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
  const res = await onGetProfileData(params.slug);
  if (!res.success) return notFound();
  const { user, isLive, subscription, subscriptionPlans } = res.data;

  const posts = await onGetBlogPostsByUsername({ username: user.username });
  const videos = await onGetVideoPostsByUsername({ username: user.username });

  return (
    <div>
      <div className="aspect-[3/1] w-full md:aspect-[6/1]">
        <img
          width={1800}
          height={300}
          src={user.imageUrl}
          alt={user.username}
          className="aspect-[5/1] w-full object-cover"
        />
      </div>
      <ProfileHead
        isLive={isLive}
        userId={user.id}
        firstName={user.firstName}
        lastName={user.lastName}
        username={user.username}
        avatarUrl={user.imageUrl}
        posterUrl={user.imageUrl}
      />
      <ProfileActions
        subscription={subscription}
        userId={user.id}
        subscriptionPlans={subscriptionPlans}
      />
      POSTS:
      <pre>{JSON.stringify(posts, null, 2)}</pre>
      VIDEOS:
      <pre>{JSON.stringify(videos, null, 2)}</pre>
    </div>
  );
};

export default ProfilePage;
