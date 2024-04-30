"use client";
import { ProfileHead } from "../_components/ProfileHead";
import { ProfileBody } from "../_components/ProfileBody";
import { UserDto } from "@/types/user.types";
import { FC } from "react";
import { Subscription } from "@prisma/client";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { BlogPostDto, VideoPostDto } from "@/types/post.types";
import Image from "next/image";

type ProfileProps = {
  user: UserDto;
  isLive: boolean;
  subscription: Subscription | null;
  subscriptionPlans: SubscriptionPlanDto[];
  videoPosts: VideoPostDto[];
  blogPosts: BlogPostDto[];
  videoPostsTotalCount: number;
  blogPostsTotalCount: number;
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
}) => {
  const { self } = useGlobalContext();

  return (
    <div className="min-h-screen">
      <div className="aspect-[3/1] w-full md:aspect-[8/1]">
        <Image
          width={1920}
          height={1080}
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
