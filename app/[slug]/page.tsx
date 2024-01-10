import { auth } from "@clerk/nextjs";
import { FC } from "react";

type CreatorPageProps = {
  params: {
    slug: string;
  };
};

const CreatorPage: FC<CreatorPageProps> = async ({ params }) => {
  const { userId } = auth();
  return <div>USER ID - {userId}</div>;
};

export default CreatorPage;
