import { FC, ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { getSubscriptions } from "@/actions/subscription.actions";

type IndexLayoutProps = {
  children: ReactNode;
};

const IndexLayout: FC<IndexLayoutProps> = async ({ children }) => {
  const subscriptions = await getSubscriptions();

  return (
    <Navigation initialSubscriptions={subscriptions}>{children}</Navigation>
  );
};

export default IndexLayout;
