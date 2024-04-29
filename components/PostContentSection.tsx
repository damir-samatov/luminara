import { FC } from "react";
import Link from "next/link";
import { stringToColor } from "@/utils/style.utils";

type PostContentSectionProps = {
  title: string;
  body: string;
  updatedAt: Date;
  username: string;
  userImageUrl: string;
};

export const PostContentSection: FC<PostContentSectionProps> = ({
  title,
  body,
  updatedAt,
  username,
  userImageUrl,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-500">{updatedAt.toDateString()}</p>
      <Link className="flex w-max items-end gap-2" href={`/users/${username}`}>
        <img
          className="h-12 w-12 rounded-full"
          src={userImageUrl}
          alt={username}
          height={360}
          width={360}
          loading="eager"
        />
        <p className="text-lg">
          <span
            style={{
              color: stringToColor(username),
            }}
          >
            @
          </span>
          <span>{username}</span>
        </p>
      </Link>
      <h2 className="text-lg lg:text-3xl">{title}</h2>
      <div
        className="lg:text-md text-sm"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
};
