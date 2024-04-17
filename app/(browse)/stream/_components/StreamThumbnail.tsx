import { ImagePicker } from "@/components/ImagePicker";
import { FC, useCallback, useState } from "react";
import { Button } from "@/components/Button";
import { classNames } from "@/utils/style.utils";
import { uploadFile } from "@/helpers/client/file.helpers";
import { onUpdateSelfStreamThumbnailKey } from "@/actions/stream-owner.actions";
import { onGetSignedFileReadUrl } from "@/actions/file.actions";
import { STREAM_THUMBNAIL_IMAGE_MAX_SIZE } from "@/configs/file.config";
import { ProgressBar } from "@/components/ProgressBar";

type StreamThumbnailProps = {
  thumbnailUrl: string;
  setThumbnailUrl: (url: string) => void;
};

export const StreamThumbnail: FC<StreamThumbnailProps> = ({
  thumbnailUrl,
  setThumbnailUrl,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onUploadThumbnail = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        if (!file) return;
        const uploadRes = await uploadFile(file, setProgress);
        if (!uploadRes) return;
        const resThumbnailKey = await onUpdateSelfStreamThumbnailKey(
          uploadRes.key
        );
        if (!resThumbnailKey.success) return;

        const { thumbnailKey } = resThumbnailKey.data.stream;

        const resThumbnailUrl = await onGetSignedFileReadUrl({
          key: thumbnailKey,
        });

        if (resThumbnailUrl.success)
          setThumbnailUrl(resThumbnailUrl.data.signedUrl);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
      setProgress(0);
    },
    [setThumbnailUrl]
  );

  const onThumbnailChange = (files: File[]) => {
    if (files[0]) {
      setFile(files[0]);
      return;
    }
    setFile(null);
  };

  const onUpdateStreamThumbnailClick = async () => {
    if (!file) return;
    setIsLoading(true);
    await onUploadThumbnail(file);
    setFile(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-gray-700 p-4">
      <div
        className={classNames(
          "grid gap-4",
          thumbnailUrl ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        )}
      >
        {thumbnailUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-800">
            <img
              src={thumbnailUrl}
              alt="Stream Thumbnail"
              width={1920}
              height={1080}
              loading="eager"
            />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex-grow">
            <ImagePicker
              maxFileSize={STREAM_THUMBNAIL_IMAGE_MAX_SIZE}
              label="Drop the thumbnail here"
              files={file ? [file] : []}
              onChange={onThumbnailChange}
            />
          </div>
          {isLoading && <ProgressBar progress={progress} />}
          {file && !isLoading && (
            <Button onClick={onUpdateStreamThumbnailClick}>
              Upload Thumbnail
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
