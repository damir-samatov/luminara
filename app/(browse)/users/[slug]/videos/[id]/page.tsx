import { FC } from "react";

type UserVideoPostPageProps = {
  params: {
    id: string;
  };
};

const UserVideoPostPage: FC<UserVideoPostPageProps> = async ({ params }) => {
  return <div>VIDEO_POST_{params.id}</div>;
};

export default UserVideoPostPage;
