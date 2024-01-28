import { FC } from "react";
import { ProfileActions } from "./_components/ProfileActions";
import { getProfileData } from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { stringToColor } from "@/utils/style.utils";

type ProfilePageProps = {
  params: {
    slug: string;
  };
};

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
  const res = await getProfileData(params.slug);

  if (!res.success) return notFound();

  const { user, isSubscribed, isBanned } = res.data;

  const userColor = stringToColor(user.username);

  return (
    <div className="flex gap-4 p-4">
      <Image
        width={200}
        height={200}
        className="h-48 w-48 rounded-full bg-gray-600"
        src={user.imageUrl}
        alt={user.username}
      />
      <div className="flex flex-col gap-6 p-4">
        <h1 className="text-4xl">
          <span style={{ color: userColor }}>@</span>
          {user.username}
        </h1>
        <Link
          className="w-min-10 block w-full rounded-md border-2 border-gray-800 bg-gray-800 px-8 py-2 text-center text-sm font-semibold hover:border-gray-700 hover:bg-gray-700"
          href={`/streams/${user.username}`}
        >
          View Stream
        </Link>
        <ProfileActions isSubscribed={isSubscribed} userId={user.id} />
      </div>
    </div>
  );
};

export default ProfilePage;
