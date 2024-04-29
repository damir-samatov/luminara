import { FC } from "react";
import { onGetVideoPostByIdAsViewer } from "@/actions/video-post-viewer.actions";
import { notFound } from "next/navigation";
import { CommentsSection } from "@/components/CommentsSection";
import { PostContentSection } from "@/components/PostContentSection";

type VideoPostPageProps = {
  params: {
    id: string;
  };
};

const VideoPostPage: FC<VideoPostPageProps> = async ({ params }) => {
  const res = await onGetVideoPostByIdAsViewer({ id: params.id });

  if (!res.success) return notFound();

  const { title, body, videoUrl, thumbnailUrl, id, updatedAt } =
    res.data.videoPost;
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
          <PostContentSection
            title={title}
            body={body}
            updatedAt={updatedAt}
            username={username}
            userImageUrl={userImageUrl}
          />
        </div>
        <CommentsSection comments={res.data.comments} postId={id} />
      </div>
    </>
  );
};

export default VideoPostPage;
