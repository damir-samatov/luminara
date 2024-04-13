"use client";
import { FC, useCallback, useState } from "react";
import { uploadFile } from "@/helpers/client/file.helpers";
import { onUpdateSubscriptionLevelImageKey } from "@/actions/subscription-level.actions";
import Image from "next/image";
import { Button } from "@/components/Button";
import {
  ELIGIBLE_IMAGE_TYPES,
  SUBSCRIPTION_PLAN_IMAGE_MAX_SIZE,
} from "@/configs/file.config";
import { toast } from "react-toastify";
import { ProgressBar } from "@/components/ProgressBar";
import { FilePreview } from "@/components/FilePreview";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FileDrop } from "@/components/FileDrop";

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
      setImageUrl(URL.createObjectURL(imageFile));
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
    <div className="flex flex-col-reverse gap-4 rounded-lg border-2 border-gray-700 p-4 md:grid md:grid-cols-3">
      <div className="flex flex-col gap-4 md:col-span-1">
        {imageFile ? (
          <>
            <FilePreview file={imageFile} />
            <div className="mt-auto">
              {isLoading ? (
                <ProgressBar progress={progress} />
              ) : (
                <div className="flex gap-2">
                  <Button
                    className="flex items-center justify-center gap-2"
                    onClick={() => setImageFile(null)}
                    type="secondary"
                  >
                    <TrashIcon className="h-3 w-3" />
                    <span>Remove</span>
                  </Button>
                  <Button
                    onClick={onImageUploadClick}
                    loadingText="Uploading..."
                    isLoading={isLoading}
                    isDisabled={isLoading || !imageFile}
                  >
                    Upload
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <FileDrop
            label="New Cover Image"
            onChange={onFilesChange}
            eligibleFileTypes={ELIGIBLE_IMAGE_TYPES}
            maxFileSize={SUBSCRIPTION_PLAN_IMAGE_MAX_SIZE}
          />
        )}
      </div>
      <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-800 md:col-span-2">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Subscription Level Image"
            width={1920}
            height={1080}
          />
        )}
      </div>
    </div>
  );
};
