import { FC, ReactNode } from "react";
import { onGetSubscriptions } from "@/actions/subscription.actions";
import { notFound } from "next/navigation";
import { BrowseNavigationContextProvider } from "@/contexts/BrowseNavigationContext";
import { Navigation } from "@/components/Navigation";

type BrowseLayoutProps = {
  children: ReactNode;
};

const BrowseLayout: FC<BrowseLayoutProps> = async ({ children }) => {
  const res = await onGetSubscriptions();

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
