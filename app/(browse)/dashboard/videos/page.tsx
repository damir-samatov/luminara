import { notFound } from "next/navigation";
import Link from "next/link";
import { classNames } from "@/utils/style.utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import { onGetSelfVideoPosts } from "@/actions/video.actions";
import { VideoPostItem } from "@/components/VideoPostItem";

const VideosPage = async () => {
  const res = await onGetSelfVideoPosts();

  if (!res.success) return notFound();

  return (
    <div className="p-4">
      <Link
        href="/dashboard/videos/new"
        className={classNames(
          "ml-auto flex max-w-max items-center gap-2 rounded-md bg-gray-800 p-4 text-sm font-semibold leading-6 text-gray-100"
        )}
      >
        <PencilIcon className="h-6 w-6" />
        <span>New Video</span>
      </Link>
      <div className="flex flex-col gap-4">
        {res.data.posts.map((post) => (
          <VideoPostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default VideosPage;
