import { User } from ".prisma/client";
import { FC } from "react";
import Link from "next/link";
import { UserProfileLogo } from "@/components/UserProfileLogo";
import { classNames } from "@/utils/style.utils";

type UserProfileLinkProps = {
  user: User;
  isActive?: boolean;
};

export const UserProfileLink: FC<UserProfileLinkProps> = ({
  user,
  isActive,
}) => {
  return (
    <Link
      href={`/users/${user.username}`}
      className={classNames(
        "flex",
        "items-center",
        "gap-x-3",
        "rounded-md",
        "p-2",
        "text-sm",
        "font-semibold",
        "leading-6",
        "text-gray-400",
        "hover:bg-gray-800",
        "hover:text-white",
        isActive && "bg-gray-800 text-white"
      )}
    >
      <UserProfileLogo user={user} />@{user.username}
    </Link>
  );
};
