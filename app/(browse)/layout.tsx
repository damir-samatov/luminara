import { FC, ReactNode } from "react";
import { notFound } from "next/navigation";
import { GlobalContextProvider } from "@/contexts/GlobalContext";
import { Navigation } from "@/components/Navigation";
import { onGetSelfContextData } from "@/actions/user.actions";

type BrowseLayoutProps = {
  children: ReactNode;
};

const BrowseLayout: FC<BrowseLayoutProps> = async ({ children }) => {
  const res = await onGetSelfContextData();

  if (!res.success) return notFound();

  return (
    <GlobalContextProvider
      subscriptions={res.data.subscriptions}
      self={res.data.self}
    >
      <Navigation>{children}</Navigation>
    </GlobalContextProvider>
  );
};

export default BrowseLayout;
