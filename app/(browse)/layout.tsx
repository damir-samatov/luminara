import { FC, ReactNode } from "react";
import { getSubscriptions } from "@/actions/subscription.actions";
import { notFound } from "next/navigation";
import { BrowseNavigationContextProvider } from "@/contexts/BrowseNavigationContext";
import { Navigation } from "@/components/Navigation";

type BrowseLayoutProps = {
  children: ReactNode;
};

const BrowseLayout: FC<BrowseLayoutProps> = async ({ children }) => {
  const res = await getSubscriptions();

  if (!res.success) return notFound();

  return (
    <BrowseNavigationContextProvider
      initialSubscriptions={res.data.subscriptions}
    >
      <Navigation>{children}</Navigation>
    </BrowseNavigationContextProvider>
  );
};

export default BrowseLayout;
