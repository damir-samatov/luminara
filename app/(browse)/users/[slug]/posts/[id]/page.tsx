import { FC } from "react";

type UserBlogPostPageProps = {
  params: {
    id: string;
  };
};

const UserBlogPostPage: FC<UserBlogPostPageProps> = async ({ params }) => {
  return <div>BLOG_POST_{params.id}</div>;
};

export default UserBlogPostPage;
