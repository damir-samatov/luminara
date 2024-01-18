"use client";
import { FC, Fragment, ReactNode, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  HomeIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { SidebarLink } from "@/components/SidebarLink";
import { UserProfileLink } from "@/components/UserProfileLink";
import { useBrowseNavigationContext } from "@/contexts/BorsweNavigationContext";

const SIDEBAR_LINKS = [
  {
    href: "/",
    label: "Home",
    icon: <HomeIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard",
    label: "My Profile",
    icon: <UserIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard/stream",
    label: "Stream",
    icon: <VideoCameraIcon className="h-6 w-6 shrink-0" />,
  },
];

const COMING_SOON_LINKS = [
  {
    href: "/dashboard/posts",
    label: "My Posts",
    icon: <Squares2X2Icon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard/community",
    label: "Community",
    icon: <UserGroupIcon className="h-6 w-6 shrink-0" />,
  },
];

type NavigationProps = {
  children: ReactNode;
};

export const Navigation: FC<NavigationProps> = ({ children }) => {
  const pathname = usePathname();
  const { subscriptions } = useBrowseNavigationContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const sidebarChildren = useMemo(
    () => (
      <nav className="flex flex-1 grow flex-col gap-3 overflow-y-auto p-4">
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
          <p className="p-2 text-sm font-semibold leading-6 text-gray-400">
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
        <p className="p-2 text-sm font-semibold leading-6 text-gray-400">
          Coming Soon:
        </p>
        {COMING_SOON_LINKS.map(({ href, label, icon }) => (
          <SidebarLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            isActive={href === pathname}
          />
        ))}
      </nav>
    ),
    [subscriptions, pathname]
  );

  const siderbarTop = useMemo(
    () => (
      <div className="sticky top-0 mt-auto bg-gray-900 px-4 py-6">
        <button className="group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
          LOGO
        </button>
      </div>
    ),
    []
  );

  const siderbarBottom = useMemo(
    () => (
      <div className="sticky bottom-0 bg-gray-900 px-4 py-6">
        <SignOutButton>
          <button className="group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
            <ArrowLeftStartOnRectangleIcon className="h-6 w-6 shrink-0" />
            Sing Out
          </button>
        </SignOutButton>
      </div>
    ),
    []
  );

  const sidebarContainer = useMemo(
    () => (
      <div className="flex h-screen w-full flex-col bg-gray-900">
        {siderbarTop}
        {sidebarChildren}
        {siderbarBottom}
      </div>
    ),
    [sidebarChildren, siderbarTop, siderbarBottom]
  );

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {sidebarContainer}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="fixed inset-y-0 z-50 hidden w-80 lg:block">
        {sidebarContainer}
      </div>

      <div className="flex min-h-screen flex-col lg:pl-80">
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 bg-gray-800 px-8">
          <button
            type="button"
            className="p-2.5 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>

          <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>

        <div className="flex grow flex-col overflow-x-clip">{children}</div>
      </div>
    </>
  );
};
