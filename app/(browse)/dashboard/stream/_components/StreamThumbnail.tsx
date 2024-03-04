import { ImagePicker } from "@/components/ImagePicker";
import React, { FC, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { classNames } from "@/utils/style.utils";

type StreamThumbnailProps = {
  thumbnailUrl: string;
  onUploadThumbnail: (file: File) => Promise<unknown>;
};

export const StreamThumbnail: FC<StreamThumbnailProps> = ({
  thumbnailUrl,
  onUploadThumbnail,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      <p className="text-lg font-semibold">Thumbnail</p>
      <div
        className={classNames(
          "grid gap-4",
          thumbnailUrl ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        )}
      >
        {thumbnailUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-800">
            <Image
              src={thumbnailUrl}
              alt="Stream Thumbnail"
              width={1920}
              height={1080}
            />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex-grow">
            <ImagePicker
              vertical
              label="Drop the thumbnail here"
              files={!!file ? [file] : []}
              onChange={onThumbnailChange}
            />
          </div>
          <div className="max-w-80">
            <Button
              isDisabled={isLoading || !file}
              isLoading={isLoading}
              loadingText="Applying the thumbnail..."
              onClick={onUpdateStreamThumbnailClick}
            >
              Apply the thumbnail
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
