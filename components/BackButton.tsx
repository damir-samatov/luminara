import { FC } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type BackButtonProps = {
  href: string;
};

export const BackButton: FC<BackButtonProps> = ({ href }) => {
  return (
    <Link
      href={href}
      className="block rounded border-2 border-transparent px-2 py-1 text-gray-300 hover:border-gray-700 lg:px-6 lg:py-2"
    >
      <ArrowLeftIcon className="h-4 w-4 md:h-6 md:w-6" />
    </Link>
  );
};
