"use client";
import { FC, useCallback, useState } from "react";
import { uploadFile } from "@/helpers/client/file.helpers";
import { onUpdateSubscriptionLevelImageKey } from "@/actions/subscription-level.actions";
import Image from "next/image";
import { ImagePicker } from "@/components/ImagePicker";
import { Button } from "@/components/Button";
import { SUBSCRIPTION_PLAN_IMAGE_MAX_SIZE } from "@/configs/file.config";
import { toast } from "react-toastify";
import { ProgressBar } from "@/components/ProgressBar";

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

  const onFilesChange = useCallback((files: File[]) => {
    if (files[0]) return setImageFile(files[0]);
    setImageFile(null);
  }, []);

  const onImageUploadClick = useCallback(async () => {
    try {
      if (!imageFile) return;
      setIsLoading(true);
      const uploadRes = await uploadFile(imageFile, setProgress);
      if (!uploadRes) return toast("Failed to upload image", { type: "error" });
      const updateRes = await onUpdateSubscriptionLevelImageKey({
        subscriptionLevelId,
        imageKey: uploadRes.key,
      });
      if (!updateRes.success)
        return toast(updateRes.message, { type: "error" });
      const imageUrl = updateRes.data.imageUrl;
      setImageUrl(imageUrl);
      setImageFile(null);
      toast("Successfully updated image.", { type: "success" });
    } catch (error) {
      toast("Something went wrong", { type: "error" });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
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
          maxFileSize={SUBSCRIPTION_PLAN_IMAGE_MAX_SIZE}
          files={imageFile ? [imageFile] : []}
          onChange={onFilesChange}
        />
        {isLoading && <ProgressBar progress={progress} />}
        {imageFile && (
          <Button
            onClick={onImageUploadClick}
            loadingText="Uploading..."
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
