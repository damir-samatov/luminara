import { FC } from "react";
import Image from "next/image";
import { ProfileActions } from "@/app/(browse)/users/[slug]/_components/ProfileActions";
import { stringToColor } from "@/utils/style.utils";

type ProfileHeadProps = {
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    isSelfSubscribed: boolean;
  };
};

export const ProfileHead: FC<ProfileHeadProps> = ({ user }) => {
  const { id, username, firstName, lastName, imageUrl, isSelfSubscribed } =
    user;
  const userColor = stringToColor(username);
  return (
    <div className="p-4">
      <div className="aspect-[6/1] w-full">
        <Image
          width={1800}
          height={300}
          src={imageUrl}
          alt={username}
          className="rounded-md"
        />
      </div>
      <div className="mt-4 flex items-end gap-4">
        <div className="h-32 w-32 overflow-hidden">
          <Image
            width={200}
            height={200}
            src={imageUrl}
            alt={username}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl">
            <span style={{ color: userColor }}>@</span>
            {username}
          </h1>
          {(firstName || lastName) && (
            <h2 className="text-sm">
              {firstName} {lastName}
            </h2>
          )}
          <div className="flex min-w-max gap-0.5 text-sm">
            <span>234k subs</span>
            <span>‧</span>
            <span>240 posts</span>
          </div>
          <ProfileActions isSubscribed={isSelfSubscribed} userId={id} />
        </div>
      </div>
    </div>
  );
};
