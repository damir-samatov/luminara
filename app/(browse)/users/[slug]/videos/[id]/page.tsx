import { FC } from "react";
import { onGetVideoPostByIdAsViewer } from "@/actions/video-post-viewer.actions";
import { notFound } from "next/navigation";
import { VideoPostDetails } from "../../_components/VideoPostDetails";

type VideoPostPageProps = {
  params: {
    id: string;
  };
};

const VideoPostPage: FC<VideoPostPageProps> = async ({ params }) => {
  const res = await onGetVideoPostByIdAsViewer({ id: params.id });
  if (!res.success) return notFound();
  return (
    <>
      <title>{res.data.videoPost.title}</title>
      <VideoPostDetails
        videoPost={res.data.videoPost}
        user={res.data.user}
        comments={res.data.comments}
      />
    </>
  );
};

export default VideoPostPage;
