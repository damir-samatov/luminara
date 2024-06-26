import { FC, useCallback, useState } from "react";
import { Button } from "@/components/Button";
import { uploadFileToS3 } from "@/helpers/client/file.helpers";
import { onGetStreamThumbnailUploadUrl } from "@/actions/stream-owner.actions";
import {
  ELIGIBLE_IMAGE_TYPES,
  STREAM_THUMBNAIL_IMAGE_MAX_SIZE,
} from "@/configs/file.config";
import { ProgressBar } from "@/components/ProgressBar";
import { toast } from "react-toastify";
import { FilePreview } from "@/components/FilePreview";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FileDrop } from "@/components/FileDrop";

type StreamThumbnailProps = {
  fallbackThumbnailUrl: string;
  thumbnailUrl: string;
  onThumbnailUrlChange: (url: string) => void;
};

export const StreamThumbnail: FC<StreamThumbnailProps> = ({
  fallbackThumbnailUrl,
  thumbnailUrl,
  onThumbnailUrlChange,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onSubmit = useCallback(async () => {
    try {
      if (!file || isLoading) return;
      setIsLoading(true);
      const res = await onGetStreamThumbnailUploadUrl({
        type: file.type,
        size: file.size,
      });
      if (!res.success) return toast(res.message, { type: "error" });
      const uploadRes = await uploadFileToS3({
        url: res.data.thumbnailUploadUrl,
        file,
        onProgress: setProgress,
      });
      if (!uploadRes)
        return toast("Failed to upload the stream thumbnail", {
          type: "error",
        });
      onThumbnailUrlChange(URL.createObjectURL(file));
      setFile(null);
      toast("Stream thumbnail uploaded successfully", { type: "success" });
    } catch (error) {
      toast("Something went wrong", { type: "error" });
      console.error(error);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  }, [file, isLoading, onThumbnailUrlChange]);

  const onFileChange = (files: File[]) => {
    const file = files[0] || null;
    setFile(file);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-gray-700 p-4">
      <div className="flex flex-col items-stretch gap-4 md:grid md:grid-cols-3">
        <img
          src={thumbnailUrl}
          className="aspect-video w-full rounded-md bg-black object-contain md:col-span-2"
          alt="Stream Thumbnail"
          width={1920}
          height={1080}
          loading="eager"
          onError={(e) => {
            e.currentTarget.setAttribute("src", fallbackThumbnailUrl);
          }}
        />
        {file ? (
          <div className="mx-auto flex w-full max-w-80 flex-col justify-between gap-2">
            <FilePreview file={file} />
            <div className="flex flex-col gap-2">
              {isLoading ? (
                <ProgressBar progress={progress} />
              ) : (
                <>
                  <Button
                    className="mt-auto flex items-center justify-center gap-1"
                    onClick={() => setFile(null)}
                    type="secondary"
                  >
                    <TrashIcon className="h-2.5 w-2.5" />
                    <span className="text-xs">Remove</span>
                  </Button>
                  <Button onClick={onSubmit} type="primary">
                    <span className="text-xs">Upload</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <FileDrop
            label="Thumbnail"
            onChange={onFileChange}
            eligibleFileTypes={ELIGIBLE_IMAGE_TYPES}
            maxFileSize={STREAM_THUMBNAIL_IMAGE_MAX_SIZE}
          />
        )}
      </div>
    </div>
  );
};
