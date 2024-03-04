import { FC } from "react";
import Link from "next/link";
import { UserProfileLogo } from "@/components/UserProfileLogo";
import { classNames, stringToColor } from "@/utils/style.utils";

type UserProfileLinkProps = {
  username: string;
  imageUrl: string;
  isActive?: boolean;
};

export const UserProfileLink: FC<UserProfileLinkProps> = ({
  username,
  imageUrl,
  isActive,
}) => {
  const userColor = stringToColor(username);
  return (
    <Link
      href={`/users/${username}`}
      className={classNames(
        "flex",
        "items-center",
        "gap-2",
        "rounded-md",
        "px-2",
        "py-1",
        "text-sm",
        "font-semibold",
        "transition-all",
        "leading-6",
        "text-gray-400",
        "hover:bg-gray-800",
        "hover:text-white",
        isActive && "bg-gray-800 text-white"
      )}
    >
      <UserProfileLogo imageUrl={imageUrl} username={username} />
      <p>
        <span
          style={{
            color: userColor,
          }}
        >
          @
        </span>
        <span>{username}</span>
      </p>
    </Link>
  );
};
