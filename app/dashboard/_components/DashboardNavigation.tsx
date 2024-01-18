"use client";
import { FC, ReactNode, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { usePathname } from "next/navigation";
import { SidebarLink } from "@/components/SidebarLink";
import { SignOutButton } from "@clerk/nextjs";
import {
  ArrowLeftStartOnRectangleIcon,
  HomeIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

type DashboardNavigationWrapperProps = {
  children: ReactNode;
};

const SIDEBAR_LINKS = [
  {
    href: "/",
    label: "Home",
    icon: <HomeIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard/stream",
    label: "Stream",
    icon: <VideoCameraIcon className="h-6 w-6 shrink-0" />,
  },
];

export const DashboardNavigationWrapper: FC<
  DashboardNavigationWrapperProps
> = ({ children }) => {
  const pathname = usePathname();

  const sidebarChildren = useMemo(
    () => (
      <nav className="flex h-full flex-1 flex-col gap-3 overflow-y-auto px-4 py-8">
        {SIDEBAR_LINKS.map(({ href, label, icon }) => (
          <SidebarLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            isActive={href === pathname}
          />
        ))}
        <div className="mt-auto">
          <SignOutButton>
            <button className="group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6 shrink-0" />
              Sing Out
            </button>
          </SignOutButton>
        </div>
      </nav>
    ),
    [pathname]
  );

  return <Navigation sidebarChildren={sidebarChildren}>{children}</Navigation>;
};
