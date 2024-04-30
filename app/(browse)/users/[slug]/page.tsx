import { FC } from "react";
import { onGetProfileData } from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import { onGetBlogPostsByUsername } from "@/actions/blog-post-viewer.actions";
import { onGetVideoPostsByUsername } from "@/actions/video-post-viewer.actions";
import { Profile } from "./_components/Profile";

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

  const { user, isLive, subscription, subscriptionPlans } = profileRes.data;

  return (
    <Profile
      user={user}
      isLive={isLive}
      subscription={subscription}
      subscriptionPlans={subscriptionPlans}
      videoPosts={videoPostsRes.data.videoPosts}
      videoPostsTotalCount={videoPostsRes.data.totalCount}
      blogPosts={blogPostsRes.data.blogPosts}
      blogPostsTotalCount={blogPostsRes.data.totalCount}
      title={profileRes.data.profile.title}
      body={profileRes.data.profile.body}
      coverImageUrl={profileRes.data.profile.coverImageUrl}
    />
  );
};

export default ProfilePage;
