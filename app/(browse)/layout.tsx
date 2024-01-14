import { FC, ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import "@/public/global.css";
import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

type BrowseLayoutProps = {
  children: ReactNode;
};

const sidebarContent = (
  <nav className="flex flex-1 flex-col">
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
      <li className="mt-auto">
        <Link
          href="/dashboard"
          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
          Dashboard
        </Link>
      </li>
    </ul>
  </nav>
);

const BrowseLayout: FC<BrowseLayoutProps> = ({ children }) => {
  return <Navigation sidebarContent={sidebarContent}>{children}</Navigation>;
};

export default BrowseLayout;
