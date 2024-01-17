"use client";
import { FC, Fragment, ReactNode, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserProfileLink } from "@/components/UserProfileLink";
import { SubscriptionWithUser } from "@/types/subscription.types";
import { useSubscriptionsStore } from "@/stores/subscriptions.store";

type NavigationProps = {
  children: ReactNode;
  initialSubscriptions: SubscriptionWithUser[];
};

export const Navigation: FC<NavigationProps> = ({
  children,
  initialSubscriptions,
}) => {
  const { subscriptions, setSubscriptions } = useSubscriptionsStore();

  useEffect(() => {
    setSubscriptions(initialSubscriptions);
  }, [setSubscriptions, initialSubscriptions]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const sidebar = useMemo(
    () => (
      <nav className="flex h-full flex-1 flex-col gap-3 px-4 py-8">
        <Link
          href="/"
          className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <HomeIcon className="h-6 w-6 shrink-0" />
          Home
        </Link>
        <Link
          href="/dashboard"
          className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <Cog6ToothIcon className="h-6 w-6 shrink-0" />
          Dashboard
        </Link>
        {subscriptions.length > 0 && (
          <p className=" p-2 text-sm font-semibold leading-6 text-gray-400">
            Subscriptions:
          </p>
        )}
        {subscriptions.map((subscription) => (
          <UserProfileLink
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
    [subscriptions]
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
                <div className="grow overflow-y-auto bg-gray-900 ring-1 ring-gray-800/10">
                  {sidebar}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
        <div className="grow overflow-y-auto bg-gray-900">{sidebar}</div>
      </div>

      <div className="lg:pl-80">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-gray-800 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>

          <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>

        <div className="overflow-x-clip">{children}</div>
      </div>
    </>
  );
};
