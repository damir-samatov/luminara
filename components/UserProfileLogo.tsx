import { FC } from "react";
import Image from "next/image";

type UserProfileLogoProps = {
  imageUrl: string;
  username: string;
};

export const UserProfileLogo: FC<UserProfileLogoProps> = ({
  imageUrl,
  username,
}) => {
  return (
    <div className="h-8 w-8 overflow-hidden rounded-full">
      <Image src={imageUrl} alt={username} height={32} width={32} />
    </div>
  );
};
