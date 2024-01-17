import React, { FC, ReactNode } from "react";
import Link from "next/link";
import { classNames } from "@/utils/tailwind.utils";

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
        "text-gray-400",
        "hover:bg-gray-800",
        "hover:text-white",
        isActive && "bg-gray-800 text-white"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
