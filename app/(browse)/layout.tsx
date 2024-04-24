import { FC, ReactNode } from "react";
import { notFound } from "next/navigation";
import { BrowseNavigationContextProvider } from "@/contexts/BrowseNavigationContext";
import { Navigation } from "@/components/Navigation";
import { onGetSelfContextData } from "@/actions/user.actions";

type BrowseLayoutProps = {
  children: ReactNode;
};

const BrowseLayout: FC<BrowseLayoutProps> = async ({ children }) => {
  const res = await onGetSelfContextData();

  if (!res.success) return notFound();

  return (
    <BrowseNavigationContextProvider
      subscriptions={res.data.subscriptions}
      self={res.data.self}
    >
      <Navigation>{children}</Navigation>
    </BrowseNavigationContextProvider>
  );
};

export default BrowseLayout;
