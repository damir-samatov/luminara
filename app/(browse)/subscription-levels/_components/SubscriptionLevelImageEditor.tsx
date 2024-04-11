"use client";
import { FC, useCallback, useState } from "react";
import { uploadFile } from "@/helpers/client/file.helpers";
import { onUpdateSubscriptionLevelImageKey } from "@/actions/subscription-level.actions";
import Image from "next/image";
import { ImagePicker } from "@/components/ImagePicker";
import { Button } from "@/components/Button";

type SubscriptionLevelImageEditorProps = {
  initialImageUrl: string | null;
  subscriptionLevelId: string;
};

export const SubscriptionLevelImageEditor: FC<
  SubscriptionLevelImageEditorProps
> = ({ initialImageUrl, subscriptionLevelId }) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onImageUploadClick = useCallback(async () => {
    if (!imageFile) return;

    setIsLoading(true);

    try {
      const uploadRes = await uploadFile(imageFile, setProgress);

      if (!uploadRes) return;

      const updateRes = await onUpdateSubscriptionLevelImageKey({
        subscriptionLevelId,
        imageKey: uploadRes.fileKey,
      });

      if (!updateRes.success) return;

      const imageUrl = updateRes.data.imageUrl;

      setImageUrl(imageUrl);
      setImageFile(null);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);

    setProgress(0);
  }, [imageFile, subscriptionLevelId]);

  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border-2 border-gray-700 p-4">
      <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-800">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Subscription Level Image"
            width={1920}
            height={1080}
          />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <ImagePicker
          label="Drop the image here"
          files={imageFile ? [imageFile] : []}
          onChange={(files) => {
            if (files[0]) return setImageFile(files[0]);
            setImageFile(null);
          }}
        />
        {imageFile && (
          <Button
            onClick={onImageUploadClick}
            loadingText={`Uploading ${(progress * 100).toFixed(2)}%`}
            isLoading={isLoading}
            isDisabled={isLoading || !imageFile}
          >
            Upload
          </Button>
        )}
      </div>
    </div>
  );
};
