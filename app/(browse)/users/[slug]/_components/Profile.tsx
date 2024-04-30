"use client";
import { ProfileHead } from "../_components/ProfileHead";
import { ProfileBody } from "../_components/ProfileBody";
import { UserDto } from "@/types/user.types";
import { FC } from "react";
import { Subscription } from "@prisma/client";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { BlogPostDto, VideoPostDto } from "@/types/post.types";
import { ProfileBanner } from "@/app/(browse)/users/[slug]/_components/ProfileBanner";

type ProfileProps = {
  user: UserDto;
  isLive: boolean;
  subscription: Subscription | null;
  subscriptionPlans: SubscriptionPlanDto[];
  videoPosts: VideoPostDto[];
  blogPosts: BlogPostDto[];
  videoPostsTotalCount: number;
  blogPostsTotalCount: number;
  coverImageUrl: string;
  title: string;
  body: string;
};

export const Profile: FC<ProfileProps> = ({
  user,
  isLive,
  subscription,
  subscriptionPlans,
  videoPosts,
  videoPostsTotalCount,
  blogPosts,
  blogPostsTotalCount,
  title,
  body,
  coverImageUrl,
}) => {
  const { self } = useGlobalContext();

  return (
    <div className="min-h-screen">
      <ProfileBanner
        coverImageUrl={coverImageUrl}
        fallbackImageUrl={user.imageUrl}
        username={user.username}
        isSelf={self.id === user.id}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 pb-96">
        <ProfileHead
          isLive={isLive}
          userId={user.id}
          firstName={user.firstName}
          lastName={user.lastName}
          username={user.username}
          avatarUrl={user.imageUrl}
          posterUrl={user.imageUrl}
        />
        <ProfileBody
          title={title}
          body={body}
          isSelf={self?.id === user.id}
          userId={user.id}
          imageUrl={user.imageUrl}
          username={user.username}
          subscription={subscription}
          subscriptionPlans={subscriptionPlans}
          videoPosts={videoPosts}
          blogPosts={blogPosts}
          videoPostsTotalCount={videoPostsTotalCount}
          blogPostsTotalCount={blogPostsTotalCount}
        />
      </div>
    </div>
  );
};
