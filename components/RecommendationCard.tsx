import { FC } from "react";
import { User } from ".prisma/client";
import Image from "next/image";
import Link from "next/link";
import { stringToColor } from "@/utils/style.utils";

type RecommendationCardProps = {
  recommendation: User;
};

const RecommendationCard: FC<RecommendationCardProps> = ({
  recommendation,
}) => {
  const { username, imageUrl } = recommendation;
  const userColor = stringToColor(username);

  return (
    <div
      className="rounded-md"
      style={{
        backgroundColor: userColor,
      }}
    >
      <Link
        className="flex w-full flex-col items-center gap-6 rounded-md bg-gray-800 px-4 py-8 transition-transform hover:translate-x-2 hover:translate-y-2"
        href={`/users/${username}`}
      >
        <div className="w-25 overflow-clip rounded-full">
          <Image
            src={imageUrl}
            alt={username}
            className="h-full w-full object-cover object-center"
            height={100}
            width={100}
          />
        </div>
        <p className="white text-lg font-bold">
          <span style={{ color: userColor }}>@ </span>
          {username}
        </p>
      </Link>
    </div>
  );
};

export default RecommendationCard;
