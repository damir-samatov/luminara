"use client";
import { FC, Fragment, ReactNode, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

type NavigationProps = {
  children: ReactNode;
  sidebarChildren: ReactNode;
};

export const Navigation: FC<NavigationProps> = ({
  children,
  sidebarChildren,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
                <div className="h-screen grow bg-gray-900 ring-1 ring-gray-800/10">
                  {sidebarChildren}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="fixed inset-y-0 z-50 hidden w-80 lg:block">
        <div className="h-screen bg-gray-900">{sidebarChildren}</div>
      </div>

      <div className="flex min-h-screen flex-col lg:pl-80">
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 bg-gray-800 px-8">
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

        <div className="flex grow flex-col overflow-x-clip">{children}</div>
      </div>
    </>
  );
};
