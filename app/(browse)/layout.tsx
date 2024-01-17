import { FC, ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { getSubscriptions } from "@/actions/subscription.actions";
import { notFound } from "next/navigation";

type IndexLayoutProps = {
  children: ReactNode;
};

const IndexLayout: FC<IndexLayoutProps> = async ({ children }) => {
  const res = await getSubscriptions();

  if (!res.success) return notFound();

  return (
    <Navigation initialSubscriptions={res.data.subscriptions}>
      {children}
    </Navigation>
  );
};

export default IndexLayout;
