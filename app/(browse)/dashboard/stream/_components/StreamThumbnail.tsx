"use client";
import { ImagePicker } from "@/components/ImagePicker";
import React, { FC, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { onUpdateSelfStreamThumbnailKey } from "@/actions/stream.actions";
import { uploadFile } from "@/helpers/file.helpers";
import { onGetSignedFileReadUrl } from "@/actions/file.actions";

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
    <div className="flex flex-col gap-6">
      <p className="text-lg font-semibold">Thumbnail</p>
      <div className="grid grid-cols-2 gap-6">
        {thumbnailUrl && (
          <div className="aspect-video w-full">
            <Image
              src={thumbnailUrl}
              alt="Stream Thumbnail"
              width={1920}
              height={1080}
            />
          </div>
        )}
        <ImagePicker
          vertical
          label="Drop the thumbnail here"
          files={!!file ? [file] : []}
          onChange={onThumbnailChange}
        />
        <Button
          size="max-content"
          isDisabled={isLoading || !file}
          isLoading={isLoading}
          loadingText="Saving thumbnail..."
          onClick={onUpdateStreamThumbnailClick}
        >
          Save Thumbnail
        </Button>
      </div>
    </div>
  );
};
