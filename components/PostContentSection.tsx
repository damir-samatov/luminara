import { FC } from "react";
import Link from "next/link";
import { stringToColor } from "@/utils/style.utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type PostContentSectionProps = {
  title: string;
  body: string;
  updatedAt: Date;
  username: string;
  userImageUrl: string;
  editUrl?: string | null;
};

export const PostContentSection: FC<PostContentSectionProps> = ({
  title,
  body,
  updatedAt,
  username,
  userImageUrl,
  editUrl = null,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-500">{updatedAt.toDateString()}</p>
          <Link
            className="flex w-max items-end gap-2"
            href={`/users/${username}`}
          >
            <Image
              className="h-12 w-12 rounded-full"
              src={userImageUrl}
              alt={username}
              height={360}
              width={360}
              loading="eager"
            />
            <p className="text-lg">
              <span
                style={{
                  color: stringToColor(username),
                }}
              >
                @
              </span>
              <span>{username}</span>
            </p>
            {editUrl && (
              <p className="rounded-lg bg-blue-900 px-2 py-1 text-xs font-semibold md:text-sm">
                YOU
              </p>
            )}
          </Link>
          <h2 className="text-lg lg:text-3xl">{title}</h2>
        </div>
        {editUrl && (
          <Link
            href={editUrl}
            className="ml-auto flex w-full max-w-max items-center justify-center gap-2 rounded border-2 border-gray-700 bg-transparent px-2 py-2 text-center text-xs font-semibold text-gray-100 hover:border-gray-600 hover:bg-gray-600 md:px-4 md:text-sm"
          >
            <PencilIcon className="h-3 w-3" />
            <span>Edit</span>
          </Link>
        )}
      </div>
      <div
        className="lg:text-md text-sm"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
};
