"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { useRouter } from "next/navigation";
import { TextEditor } from "@/components/TextEditor";
import { FilePreview } from "@/components/FilePreview";
import { ProgressBar } from "@/components/ProgressBar";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FileDrop } from "@/components/FileDrop";
import {
  ELIGIBLE_IMAGE_TYPES,
  ELIGIBLE_VIDEO_TYPES,
  VIDEO_MAX_SIZE,
  VIDEO_THUMBNAIL_IMAGE_MAX_SIZE,
} from "@/configs/file.config";
import { BackButton } from "@/components/BackButton";
import { toast } from "react-toastify";
import { onCreateVideoPost } from "@/actions/video.actions";
import { uploadFileToS3 } from "@/helpers/client/file.helpers";
import { SubscriptionPlan } from "@prisma/client";
import { Dropdown } from "@/components/Dropdown";

type VideoPostCreatorProps = {
  subscriptionPlans: SubscriptionPlan[];
};

export const VideoPostCreator: FC<VideoPostCreatorProps> = ({
  subscriptionPlans,
}) => {
  const router = useRouter();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState({
    title: "",
    body: "",
  });

  const onPostContentChange = useCallback(
    <T extends keyof typeof content>(key: T, value: (typeof content)[T]) => {
      if (isLoading) return;
      setContent((prev) => ({ ...prev, [key]: value }));
    },
    [isLoading]
  );

  const onVideoFilesChange = useCallback((files: File[]) => {
    if (files[0]) return setVideoFile(files[0]);
    setVideoFile(null);
  }, []);

  const onThumbnailFilesChange = useCallback((files: File[]) => {
    if (files[0]) return setThumbnailFile(files[0]);
    setThumbnailFile(null);
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      if (content.title.length < 1 || !videoFile || !thumbnailFile || isLoading)
        return;
      setIsLoading(true);

      const res = await onCreateVideoPost({
        title: content.title,
        body: content.body,
        video: {
          size: videoFile.size,
          type: videoFile.type,
        },
        thumbnail: {
          size: thumbnailFile.size,
          type: thumbnailFile.type,
        },
      });

      if (!res.success)
        return toast(res.message, {
          type: "error",
        });

      const [videoUploadRes, thumbnailUploadRes] = await Promise.all([
        uploadFileToS3({
          file: videoFile,
          url: res.data.videoUploadUrl,
          onProgress: setVideoProgress,
        }),
        uploadFileToS3({
          file: thumbnailFile,
          url: res.data.thumbnailUploadUrl,
          onProgress: setThumbnailProgress,
        }),
      ]);
      if (!videoUploadRes || !thumbnailUploadRes)
        return toast("Failed uploading", { type: "error" });
      toast("Video is successfully published", { type: "success" });
      router.push("/videos");
    } catch (error) {
      toast("Something went wrong! Please try again.", { type: "error" });
      console.error(error);
      setIsLoading(false);
    }
  }, [isLoading, content, videoFile, thumbnailFile, router]);

  const [activeOption, setActiveOption] = useState({
    value: "follower",
    label: "Follower",
  });

  const options = useMemo(() => {
    return [
      {
        value: "follower",
        label: "Follower - Free",
      },
      ...subscriptionPlans
        .sort((a, b) => a.price - b.price)
        .map((s) => ({
          value: s.id,
          label: `${s.title} - ${s.price}`,
        })),
    ];
  }, [subscriptionPlans]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <BackButton href="/videos" />
        <h2 className="text-sm md:text-xl lg:text-3xl">New Video</h2>
      </div>

      <div className="grid min-h-72 grid-cols-3 gap-4">
        {videoFile ? (
          <div className="flex flex-col gap-2">
            <FilePreview file={videoFile} />
            <div className="mt-auto">
              {isLoading ? (
                <ProgressBar progress={videoProgress} />
              ) : (
                <Button
                  className="flex items-center justify-center gap-1"
                  onClick={() => setVideoFile(null)}
                  type="danger"
                >
                  <TrashIcon className="h-2.5 w-2.5" />
                  <span className="text-xs">Remove</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <FileDrop
            label="Video File"
            onChange={onVideoFilesChange}
            eligibleFileTypes={ELIGIBLE_VIDEO_TYPES}
            maxFileSize={VIDEO_MAX_SIZE}
          />
        )}
        {thumbnailFile ? (
          <div className="flex flex-col gap-2">
            <FilePreview file={thumbnailFile} />
            <div className="mt-auto">
              {isLoading ? (
                <ProgressBar progress={thumbnailProgress} />
              ) : (
                <Button
                  className="flex items-center justify-center gap-1"
                  onClick={() => setThumbnailFile(null)}
                  type="danger"
                >
                  <TrashIcon className="h-2.5 w-2.5" />
                  <span className="text-xs">Remove</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <FileDrop
            label="Thumbnail Image"
            onChange={onThumbnailFilesChange}
            eligibleFileTypes={ELIGIBLE_IMAGE_TYPES}
            maxFileSize={VIDEO_THUMBNAIL_IMAGE_MAX_SIZE}
          />
        )}
        <div className="flex flex-col justify-end">
          <Dropdown
            options={options}
            active={activeOption}
            onChange={setActiveOption}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border-2 border-gray-700 p-4">
        <div>
          <p>Title</p>
          <TextInput
            isDisabled={isLoading}
            value={content.title}
            onChange={(value) => onPostContentChange("title", value)}
          />
        </div>
        <div>
          <p>Description</p>
          <TextEditor
            isDisabled={isLoading}
            value={content.body}
            onChange={(value) => onPostContentChange("body", value)}
          />
        </div>
        <Button
          isLoading={isLoading}
          isDisabled={
            isLoading || !content.title || !videoFile || !thumbnailFile
          }
          onClick={onSubmit}
          loadingText="Publishing..."
        >
          Publish
        </Button>
      </div>
    </div>
  );
};
