"use client";
import { useCallback, useState } from "react";
import { TextInput } from "@/components/TextInput";
import { TextEditor } from "@/components/TextEditor";
import { Button } from "@/components/Button";
import { SliderInput } from "@/components/SliderInput";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/helpers/client/file.helpers";
import { onCreateSubscriptionLevel } from "@/actions/subscription-level.actions";
import { ProgressBar } from "@/components/ProgressBar";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  ELIGIBLE_IMAGE_TYPES,
  SUBSCRIPTION_PLAN_IMAGE_MAX_SIZE,
} from "@/configs/file.config";
import { FileDrop } from "@/components/FileDrop";
import { FilePreview } from "@/components/FilePreview";
import { BackButton } from "@/components/BackButton";

export const SubscriptionLevelCreator = () => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionLevelContent, setSubscriptionLevelContent] = useState({
    title: "",
    description: "",
    price: 0.1,
  });

  const onChange = useCallback(
    <T extends keyof typeof subscriptionLevelContent>(
      key: T,
      value: (typeof subscriptionLevelContent)[T]
    ) => {
      setSubscriptionLevelContent((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const onSubmit = useCallback(async () => {
    try {
      if (!subscriptionLevelContent.title || !imageFile || isLoading) return;

      setIsLoading(true);
      setProgress(0);

      const imageUpload = await uploadFile(imageFile, setProgress);

      if (!imageUpload)
        return toast("Failed to upload. Please try again later.", {
          type: "error",
        });

      const res = await onCreateSubscriptionLevel({
        title: subscriptionLevelContent.title,
        description: subscriptionLevelContent.description,
        price: subscriptionLevelContent.price,
        imageKey: imageUpload.key,
      });

      if (!res.success)
        return toast("Failed to create. Please try again later.", {
          type: "error",
        });

      toast("Subscription plan created successfully", { type: "success" });
      router.push("/subscription-plans");
    } catch (error) {
      console.error(error);
      toast("Something went wrong. Please try again later.", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setProgress(1);
    }
  }, [isLoading, subscriptionLevelContent, imageFile, router]);

  const onFilesChange = useCallback((files: File[]) => {
    if (files[0]) return setImageFile(files[0]);
    setImageFile(null);
  }, []);

  const isCreateDisabled =
    isLoading || !subscriptionLevelContent.title || !imageFile;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4">
      <div className="flex items-center gap-2">
        <BackButton href="/subscription-plans" />
        <h2 className="text-sm md:text-xl lg:text-3xl">
          New Subscription Plan
        </h2>
      </div>
      <div className="flex grid-cols-3 flex-col gap-4 lg:grid">
        <div className="col-span-1 flex flex-col gap-4">
          {imageFile ? (
            <>
              <FilePreview file={imageFile} />
              <div className="mt-auto">
                {isLoading ? (
                  <ProgressBar progress={progress} />
                ) : (
                  <Button
                    className="flex items-center justify-center gap-2"
                    onClick={() => setImageFile(null)}
                    type="secondary"
                  >
                    <TrashIcon className="h-3 w-3" />
                    <span>Remove</span>
                  </Button>
                )}
              </div>
            </>
          ) : (
            <FileDrop
              label="Cover Image"
              onChange={onFilesChange}
              eligibleFileTypes={ELIGIBLE_IMAGE_TYPES}
              maxFileSize={SUBSCRIPTION_PLAN_IMAGE_MAX_SIZE}
            />
          )}
        </div>
        <div className="col-span-2 flex flex-col gap-4 rounded-lg border-2 border-gray-700 p-4">
          <div>
            <p>Title</p>
            <TextInput
              value={subscriptionLevelContent.title}
              onChange={(value) => onChange("title", value)}
            />
          </div>
          <div>
            <p>Description</p>
            <TextEditor
              placeholder="Subscription level description"
              value={subscriptionLevelContent.description}
              onChange={(value) => onChange("description", value)}
            />
          </div>
          <div>
            <p>Price {subscriptionLevelContent.price}$</p>
            <SliderInput
              value={subscriptionLevelContent.price}
              onChange={(value) => onChange("price", value)}
              max={100}
              min={0.1}
              step={0.1}
            />
          </div>
        </div>
      </div>
      <div className="ml-auto w-full sm:max-w-80">
        <Button
          onClick={onSubmit}
          loadingText="Creating..."
          isDisabled={isCreateDisabled}
          isLoading={isLoading}
        >
          Create
        </Button>
      </div>
    </div>
  );
};
