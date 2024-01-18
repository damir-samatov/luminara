"use client";
import { FC, ReactNode, useEffect, useMemo } from "react";
import { SubscriptionWithUser } from "@/types/subscription.types";
import { Navigation } from "@/components/Navigation";
import { useSubscriptionsStore } from "@/stores/subscriptions.store";
import { usePathname } from "next/navigation";
import { SidebarLink } from "@/components/SidebarLink";
import { UserProfileLink } from "@/components/UserProfileLink";
import { SignOutButton } from "@clerk/nextjs";
import {
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

type BrowseNavigationWrapperProps = {
  initialSubscriptions: SubscriptionWithUser[];
  children: ReactNode;
};

const SIDEBAR_LINKS = [
  {
    href: "/",
    label: "Home",
    icon: <HomeIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <Cog6ToothIcon className="h-6 w-6 shrink-0" />,
  },
];

export const BrowseNavigationWrapper: FC<BrowseNavigationWrapperProps> = ({
  initialSubscriptions,
  children,
}) => {
  const { subscriptions, setSubscriptions } = useSubscriptionsStore();
  const pathname = usePathname();

  useEffect(() => {
    setSubscriptions(initialSubscriptions);
  }, [setSubscriptions, initialSubscriptions]);

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
        {subscriptions.length > 0 && (
          <p className=" p-2 text-sm font-semibold leading-6 text-gray-400">
            Subscriptions:
          </p>
        )}
        {subscriptions.map((subscription) => (
          <UserProfileLink
            isActive={pathname === `/users/${subscription.user.username}`}
            key={subscription.user.id}
            user={subscription.user}
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
    [subscriptions, pathname]
  );

  return <Navigation sidebarChildren={sidebarChildren}>{children}</Navigation>;
};
