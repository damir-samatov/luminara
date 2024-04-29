import { FC } from "react";
import { onGetProfileData } from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import { ProfileHead } from "./_components/ProfileHead";
import { onGetBlogPostsByUsername } from "@/actions/blog-post-viewer.actions";
import { onGetVideoPostsByUsername } from "@/actions/video-post-viewer.actions";
import { ProfileBody } from "@/app/(browse)/users/[slug]/_components/ProfileBody";

type ProfilePageProps = {
  params: {
    slug: string;
  };
};

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
  const [profileRes, blogPostsRes, videoPostsRes] = await Promise.all([
    onGetProfileData(params.slug),
    onGetBlogPostsByUsername({ username: params.slug }),
    onGetVideoPostsByUsername({ username: params.slug }),
  ]);

  if (!profileRes.success || !videoPostsRes.success || !blogPostsRes.success)
    return notFound();

  const { user, isLive, isSelf, subscription, subscriptionPlans } =
    profileRes.data;

  return (
    <div className="min-h-screen">
      <div className="aspect-[3/1] w-full md:aspect-[8/1]">
        <img
          width={1800}
          height={300}
          src={user.imageUrl}
          alt={user.username}
          className="aspect-[5/1] w-full object-cover"
        />
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 pb-96">
        <ProfileHead
          isLive={isLive}
          userId={user.id}
          firstName={user.firstName}
          lastName={user.lastName}
          username={user.username}
          avatarUrl={user.imageUrl}
          posterUrl={user.imageUrl}
        />

        <hr className="border-gray-600" />

        <ProfileBody
          isSelf={isSelf}
          userId={user.id}
          imageUrl={user.imageUrl}
          username={user.username}
          subscription={subscription}
          subscriptionPlans={subscriptionPlans}
          videoPosts={videoPostsRes.data.videoPosts}
          videoPostsTotalCount={videoPostsRes.data.totalCount}
          blogPosts={blogPostsRes.data.blogPosts}
          blogPostsTotalCount={blogPostsRes.data.totalCount}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
