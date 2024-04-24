import { FC } from "react";
import { VideoPostDto } from "@/types/post.types";
import { BackButton } from "@/components/BackButton";
import { VideoPostDeleterModal } from "../_components/VideoPostDeleteModal";

type VideoPostEditorProps = {
  videoPost: VideoPostDto;
};

export const VideoPostEditor: FC<VideoPostEditorProps> = ({ videoPost }) => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-2 lg:p-6">
      <div className="flex items-center gap-2">
        <BackButton href="/videos" />
        <h2 className="text-sm md:text-xl lg:text-3xl">{videoPost.title}</h2>
        <div className="ml-auto">
          <VideoPostDeleterModal id={videoPost.id} />
        </div>
      </div>
    </div>
  );
};
