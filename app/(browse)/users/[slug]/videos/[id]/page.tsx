import { FC } from "react";
import { onGetVideoPostByIdAsViewer } from "@/actions/video-post-viewer.actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stringToColor } from "@/utils/style.utils";
import { CommentsSection } from "@/components/CommentsSection";

type VideoPostPageProps = {
  params: {
    id: string;
  };
};

const VideoPostPage: FC<VideoPostPageProps> = async ({ params }) => {
  const res = await onGetVideoPostByIdAsViewer({ id: params.id });

  if (!res.success) return notFound();

  const { title, body, videoUrl, thumbnailUrl, id } = res.data.videoPost;
  const { username, imageUrl: userImageUrl } = res.data.user;

  return (
    <>
      <title>{title}</title>
      <div className="mx-auto flex w-full max-w-7xl flex-grow flex-col gap-4 p-4 md:grid md:grid-cols-3">
        <div className="col-span-2 flex flex-col gap-4">
          <div>
            <video
              src={videoUrl}
              poster={thumbnailUrl}
              controls
              className="aspect-video w-full overflow-hidden rounded-xl bg-black object-contain"
            />
          </div>
          <h2 className="text-lg lg:text-3xl">{title}</h2>
          <Link
            className="flex w-max items-end gap-2"
            href={`/users/${username}`}
          >
            <img
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
          </Link>
          <div
            className="hidden text-sm lg:block"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>

        <div>
          <CommentsSection comments={res.data.comments} postId={id} />
        </div>
      </div>
    </>
  );
};

export default VideoPostPage;
