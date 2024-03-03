"use client";
import { ImagePicker } from "@/components/ImagePicker";
import React, { FC, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { onUpdateSelfStreamThumbnailKey } from "@/actions/stream.actions";
import { uploadFile } from "@/helpers/file.helpers";
import { onGetSignedFileReadUrl } from "@/actions/file.actions";
import { classNames } from "@/utils/style.utils";

type StreamThumbnailProps = {
  initialThumbnailUrl: string;
};

export const StreamThumbnail: FC<StreamThumbnailProps> = ({
  initialThumbnailUrl,
}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);
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
    setIsLoading(true);

    try {
      if (!file) return;
      const uploadRes = await uploadFile(file);
      if (!uploadRes) return;
      const resThumbnailKey = await onUpdateSelfStreamThumbnailKey(
        uploadRes.fileKey
      );
      if (!resThumbnailKey.success) return;

      const { thumbnailKey } = resThumbnailKey.data.stream;

      const resThumbnailUrl = await onGetSignedFileReadUrl({
        key: thumbnailKey,
      });

      if (resThumbnailUrl.success)
        setThumbnailUrl(resThumbnailUrl.data.signedUrl);

      setFile(null);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
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
          <Button
            size="max-content"
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
  );
};