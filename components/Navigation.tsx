"use client";
import { FC, Fragment, ReactNode, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { SidebarLink } from "@/components/SidebarLink";
import { UserProfileLink } from "@/components/UserProfileLink";
import { useBrowseNavigationContext } from "@/contexts/BrowseNavigationContext";
import { COMING_SOON_LINKS, SIDEBAR_LINKS } from "@/configs/navigation.config";
import Link from "next/link";
import { Search } from "@/components/Search";

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
      <nav className="flex flex-1 grow flex-col gap-2 overflow-y-auto p-4">
        {SIDEBAR_LINKS.map(({ href, label, icon, activeOn }) => (
          <SidebarLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            isActive={activeOn.indexOf(pathname) !== -1}
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
            imageUrl={subscription.user.imageUrl}
            username={subscription.user.username}
          />
        ))}
        <p className="p-2 text-sm font-semibold leading-6 text-gray-400">
          Coming Soon:
        </p>
        {COMING_SOON_LINKS.map(({ href, label, icon }) => (
          <div key={href} className="pointer-events-none cursor-not-allowed">
            <SidebarLink
              href={href}
              label={label}
              icon={icon}
              isActive={href === pathname}
            />
          </div>
        ))}
      </nav>
    ),
    [subscriptions, pathname]
  );

  const siderbarTop = useMemo(
    () => (
      <div className="sticky top-0 mt-auto bg-gray-900">
        <Link
          href="/"
          className="font-bolder flex items-end gap-2 fill-gray-400 p-6 pb-2 pt-4 text-2xl leading-none text-gray-400 hover:fill-gray-200 hover:text-gray-200"
        >
          <svg
            className="h-6 w-6"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
          >
            <g>
              <path
                d="M50,99.9925c0,-41.415 33.5925,-74.9925 75,-74.9925c38.835,0 70.77,29.5175 74.61,67.335c0.195,2.5375 0.39,5.0775 0.39,7.665c0,55.225 -44.775,100 -100,100c-55.225,0 -100,-44.775 -100,-100c0,-55.225 44.775,-100 100,-100c15.8525,0 30.7925,3.7925 44.115,10.36c-6.1675,-1.3125 -12.555,-2.0275 -19.115,-2.0275c-50.61425,0 -91.662,41.0345 -91.6675,91.65v0.0175c0.004,36.814 29.8525,66.6575 66.6675,66.6575c36.815,0 66.6535,-29.8435 66.6675,-66.6575v-0.0175c-0.0155,-27.6005 -22.38325,-49.9825 -50,-49.9825c-27.6125,0 -50,22.395 -50,50c0,18.415 14.925,33.33 33.3325,33.33c18.4075,0 33.3325,-14.9175 33.3325,-33.3325c0,-9.2125 -7.46,-16.6675 -16.665,-16.6675c-9.205,0 -16.6675,7.455 -16.6675,16.6675h16.6675c0,9.2125 -7.4625,16.6675 -16.6675,16.6675c-9.205,0 -16.6675,-7.455 -16.6675,-16.6675c0,-18.3975 14.9275,-33.3325 33.335,-33.3325c18.415,0 33.3325,14.935 33.3325,33.3275c-0.0075,27.6125 -22.3875,50 -50,50c-27.6125,0 -50,-22.3875 -50,-50z"
                fillRule="evenodd"
              ></path>
            </g>
          </svg>
          <span>luminara</span>
        </Link>
      </div>
    ),
    []
  );

  const siderbarBottom = useMemo(
    () => (
      <div className="sticky bottom-0 bg-gray-900 px-4 py-6">
        <SignOutButton>
          <button className="group flex w-full gap-2 rounded-md px-2 py-1 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
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
              <Dialog.Panel className="relative mr-16 flex w-full max-w-72 flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex justify-center">
                    <button
                      type="button"
                      className="p-4"
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

      <div className="fixed inset-y-0 z-50 hidden w-72 lg:block">
        {sidebarContainer}
      </div>

      <div className="flex min-h-screen flex-col lg:pl-72">
        <div className="sticky top-0 z-40 flex h-14 items-center gap-x-4 bg-gray-800 px-4">
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>

          <div className="flex w-full items-center gap-x-4 lg:gap-x-6">
            <Search />
            <div className="ml-auto">
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-col overflow-x-clip">
          {children}
        </div>
      </div>
    </>
  );
};
