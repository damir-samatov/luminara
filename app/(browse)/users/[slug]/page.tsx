import { FC } from "react";
import { onGetProfileData } from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import { ProfileHead } from "./_components/ProfileHead";
import { onGetBlogPostsByUsername } from "@/actions/blog-post-viewer.actions";
import { onGetVideoPostsByUsername } from "@/actions/video-post-viewer.actions";
import { ProfileActions } from "./_components/ProfileActions";
import { VideoPostsList } from "@/components/VideoPostsList";
import { BlogPostsList } from "@/components/BlogPostsList";

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

  if (!profileRes.success) return notFound();

  const { user, isLive, isSelf, subscription, subscriptionPlans } =
    profileRes.data;

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
      <div className="flex flex-col gap-4 p-4">
        <ProfileActions
          subscription={subscription}
          userId={user.id}
          subscriptionPlans={subscriptionPlans}
        />
        {videoPostsRes.success && (
          <VideoPostsList
            isSelf={isSelf}
            posts={videoPostsRes.data.videoPosts}
            link={`/users/${user.username}/videos`}
          />
        )}
        {blogPostsRes.success && (
          <BlogPostsList
            isSelf={isSelf}
            posts={blogPostsRes.data.blogPosts}
            link={`/users/${user.username}/posts`}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
