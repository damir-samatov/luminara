import { FC, ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";

type DashboardLayoutProps = {
  children: ReactNode;
};

const sidebarContent = (
  <nav className="flex flex-1 flex-col">
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
      <li className="mt-auto">
        <Link
          href="/"
          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <HomeIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
          Home
        </Link>
      </li>
    </ul>
  </nav>
);

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return <Navigation sidebarContent={sidebarContent}>{children}</Navigation>;
};

export default DashboardLayout;
