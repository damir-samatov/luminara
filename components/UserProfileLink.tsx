import { User } from ".prisma/client";
import { FC } from "react";
import Link from "next/link";
import { UserProfileLogo } from "@/components/UserProfileLogo";

type UserProfileLinkProps = {
  user: User;
};

export const UserProfileLink: FC<UserProfileLinkProps> = ({ user }) => {
  return (
    <Link
      href={`/users/${user.username}`}
      className="group flex items-center gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
    >
      <UserProfileLogo user={user} />
      {user.username}
    </Link>
  );
};
