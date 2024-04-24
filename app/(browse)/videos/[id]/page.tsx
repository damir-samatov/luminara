import { FC } from "react";
import { VideoPostEditor } from "../_components/VideoPostEditor";
import { onGetVideoPostById } from "@/actions/video.actions";
import { notFound } from "next/navigation";

type VideoPostDetailsPageProps = {
  params: {
    id: string;
  };
};

const VideoPostEditorPage: FC<VideoPostDetailsPageProps> = async ({
  params,
}) => {
  const res = await onGetVideoPostById(params.id);

  if (!res.success) return notFound();

  return (
    <>
      <title>Video Editor {params.id}</title>
      <VideoPostEditor videoPost={res.data.videoPost} />
    </>
  );
};

export default VideoPostEditorPage;
