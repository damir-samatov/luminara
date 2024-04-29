import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { stringToColor } from "@/utils/style.utils";

type UserCardProps = {
  imageUrl: string;
  username: string;
  date: Date;
};

const UserCard: FC<UserCardProps> = ({ username, imageUrl, date }) => {
  const userColor = stringToColor(username);

  return (
    <div
      className="rounded-md"
      style={{
        backgroundColor: userColor,
      }}
    >
      <Link
        className="flex w-full flex-col items-center gap-2 rounded-md bg-gray-800 px-4 py-8 transition-transform hover:translate-x-2 hover:translate-y-2"
        href={`/users/${username}`}
      >
        <Image
          height={100}
          width={100}
          src={imageUrl}
          alt={username}
          className="h-24 w-24 rounded-full"
        />
        <p className="text-lg font-bold text-gray-100">
          <span style={{ color: userColor }}>@</span>
          {username}
        </p>
        <p className="text-xs text-gray-300">
          Creator since {date.toDateString()}
        </p>
      </Link>
    </div>
  );
};

export default UserCard;
