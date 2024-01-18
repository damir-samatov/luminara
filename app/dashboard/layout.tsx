import { FC, ReactNode } from "react";
import { getSubscriptions } from "@/actions/subscription.actions";
import { notFound } from "next/navigation";
import { DashboardNavigationWrapper } from "@/app/dashboard/_components/DashboardNavigation";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout: FC<DashboardLayoutProps> = async ({ children }) => {
  const res = await getSubscriptions();

  if (!res.success) return notFound();

  return <DashboardNavigationWrapper>{children}</DashboardNavigationWrapper>;
};

export default DashboardLayout;
