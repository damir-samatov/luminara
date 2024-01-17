import { User } from ".prisma/client";
import { FC } from "react";
import Image from "next/image";

type UserProfileLogoProps = {
  user: User;
};

export const UserProfileLogo: FC<UserProfileLogoProps> = ({ user }) => {
  return (
    <div className="h-8 w-8 overflow-hidden rounded-full">
      <Image
        src={user.imageUrl}
        alt={user.username}
        className="h-full w-full object-cover object-center"
        height={32}
        width={32}
      />
    </div>
  );
};
