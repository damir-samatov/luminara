import { FC, ReactNode } from "react";
import { Navigation } from "@/components/Navigation";

type BrowseLayoutProps = {
  children: ReactNode;
};

const BrowseLayout: FC<BrowseLayoutProps> = ({ children }) => {
  return <Navigation>{children}</Navigation>;
};

export default BrowseLayout;
