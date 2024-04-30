"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { BlogPostDto, VideoPostDto } from "@/types/post.types";
import { BlogPostsList } from "@/components/BlogPostsList";
import { VideoPostsList } from "@/components/VideoPostsList";
import { Subscription } from "@prisma/client";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { onGetBlogPostsByUsername } from "@/actions/blog-post-viewer.actions";
import { onGetVideoPostsByUsername } from "@/actions/video-post-viewer.actions";
import { toast } from "react-toastify";
import { ProfileSubscriptionEditor } from "@/app/(browse)/users/[slug]/_components/ProfileSubscriptionEditor";

type ProfileBodyProps = {
  isSelf: boolean;
  username: string;
  userId: string;
  imageUrl: string;
  subscriptionPlans: SubscriptionPlanDto[];
  videoPosts: VideoPostDto[];
  blogPosts: BlogPostDto[];
  subscription: Subscription | null;
  videoPostsTotalCount: number;
  blogPostsTotalCount: number;
};

export const ProfileBody: FC<ProfileBodyProps> = ({
  isSelf,
  username,
  imageUrl,
  subscriptionPlans,
  subscription: savedSubscription,
  videoPosts: savedVideoPosts,
  blogPosts: savedBlogPosts,
  userId,
  videoPostsTotalCount,
  blogPostsTotalCount,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [videoPosts, setVideoPosts] = useState(savedVideoPosts);
  const [blogPosts, setBlogPosts] = useState(savedBlogPosts);
  const [subscription, setSubscription] = useState(savedSubscription);

  const onSubscriptionChanged = useCallback(
    async (newSubscription: Subscription | null) => {
      setSubscription(newSubscription);
      try {
        const [blogPostsRes, videoPostsRes] = await Promise.all([
          onGetBlogPostsByUsername({ username }),
          onGetVideoPostsByUsername({ username }),
        ]);

        if (blogPostsRes.success) {
          setBlogPosts(blogPostsRes.data.blogPosts);
        } else {
          toast("Failed to refresh posts", { type: "error" });
        }

        if (videoPostsRes.success) {
          setVideoPosts(videoPostsRes.data.videoPosts);
        } else {
          toast("Failed to refresh videos", { type: "error" });
        }
      } catch (error) {
        toast("Failed to refresh videos and posts", { type: "error" });
      }
    },
    [username]
  );

  const tabs = useMemo(
    () => [
      {
        label: "Videos",
        component: (
          <div className="flex flex-col gap-6">
            <p className="text-lg">
              You have access to {videoPosts.length} out of{" "}
              {videoPostsTotalCount} videos
            </p>
            <VideoPostsList
              key={videoPosts.length}
              isSelf={isSelf}
              posts={videoPosts}
              link={`/users/${username}/videos`}
            />
          </div>
        ),
      },
      {
        label: "Posts",
        component: (
          <div className="flex flex-col gap-6">
            <p className="text-lg">
              You have access to {blogPosts.length} out of {blogPostsTotalCount}{" "}
              posts
            </p>
            <BlogPostsList
              key={blogPosts.length}
              isSelf={isSelf}
              posts={blogPosts}
              link={`/users/${username}/posts`}
            />
          </div>
        ),
      },
      {
        label: "Subscription Plans",
        component: (
          <ProfileSubscriptionEditor
            onSubscriptionChanged={onSubscriptionChanged}
            userId={userId}
            imageUrl={imageUrl}
            username={username}
            subscription={subscription}
            subscriptionPlans={subscriptionPlans}
          />
        ),
      },
    ],
    [
      blogPostsTotalCount,
      videoPostsTotalCount,
      onSubscriptionChanged,
      subscription,
      isSelf,
      username,
      blogPosts,
      videoPosts,
      imageUrl,
      userId,
      subscriptionPlans,
    ]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid max-w-96 grid-cols-2 gap-2">
        {tabs.map((tab, i) => (
          <Button
            type={activeTab === i ? "primary" : "secondary"}
            onClick={() => setActiveTab(i)}
            key={tab.label}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div>{tabs[activeTab]?.component}</div>
    </div>
  );
};
