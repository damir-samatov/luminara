import React, { FC, ReactNode } from "react";
import Link from "next/link";
import { classNames } from "@/utils/style.utils";

type SidebarLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  isActive?: boolean;
};

export const SidebarLink: FC<SidebarLinkProps> = ({
  href,
  icon,
  label,
  isActive = false,
}) => {
  return (
    <Link
      href={href}
      className={classNames(
        "flex",
        "items-center",
        "gap-x-3",
        "rounded-md",
        "p-2",
        "text-sm",
        "font-semibold",
        "leading-6",
        "transition-all",
        "hover:bg-gray-800",
        "hover:text-gray-100",
        isActive ? "bg-gray-800 text-gray-100" : "text-gray-400"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
