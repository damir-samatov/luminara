"use client";
import { FC, useCallback, useState } from "react";
import { TextInput } from "@/components/TextInput";
import { useRouter } from "next/navigation";
import { TextEditor } from "@/components/TextEditor";
import { BackButton } from "@/components/BackButton";
import { SubscriptionPlanSelector } from "@/components/SubscriptionPlanSelector";
import { Button } from "@/components/Button";
import { FilePreview } from "@/components/FilePreview";
import { ProgressBar } from "@/components/ProgressBar";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FileDrop } from "@/components/FileDrop";
import {
  BLOG_POST_IMAGE_MAX_SIZE,
  ELIGIBLE_IMAGE_TYPES,
} from "@/configs/file.config";
import { toast } from "react-toastify";
import { uploadFileToS3 } from "@/helpers/client/file.helpers";
import { onCreateBlogPost } from "@/actions/blog-post.actions";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";

type BlogPostCreatorProps = {
  subscriptionPlans: SubscriptionPlanDto[];
  freeFollowerImageUrl: string;
};

export const BlogPostCreator: FC<BlogPostCreatorProps> = ({
  subscriptionPlans,
  freeFollowerImageUrl,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageProgress, setImageProgress] = useState(0);
  const [content, setPostContent] = useState({
    title: "",
    body: "",
  });
  const [activeSubscriptionPlan, setActiveSubscriptionPlan] =
    useState<SubscriptionPlanDto | null>(null);

  const onPostContentChange = <T extends keyof typeof content>(
    key: T,
    value: (typeof content)[T]
  ) => {
    setPostContent((prev) => ({ ...prev, [key]: value }));
  };

  const onImageFileChange = useCallback((files: File[]) => {
    if (files[0]) return setImageFile(files[0]);
    setImageFile(null);
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      if (!imageFile || !content.title || isLoading) return;
      setIsLoading(true);

      const res = await onCreateBlogPost({
        title: content.title,
        body: content.body,
        subscriptionPlanId: activeSubscriptionPlan
          ? activeSubscriptionPlan.id
          : null,
        image: {
          size: imageFile.size,
          type: imageFile.type,
        },
      });

      if (!res.success) {
        setIsLoading(false);
        return toast(res.message, {
          type: "error",
        });
      }

      const imageUploadRes = await uploadFileToS3({
        file: imageFile,
        url: res.data.imageUploadUrl,
        onProgress: setImageProgress,
      });

      if (!imageUploadRes) {
        setIsLoading(false);
        return toast("Failed uploading", { type: "error" });
      }

      toast.success("Post created successfully");
      router.push("/posts");
    } catch (error) {
      toast.error("Failed to create post");
      setIsLoading(false);
    }
  }, [content, imageFile, activeSubscriptionPlan, router, isLoading]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <BackButton href="/posts" />
        <h2 className="text-sm sm:text-xl lg:text-3xl">New Blog Post</h2>
      </div>
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
        <div className="flex flex-grow flex-col gap-2 rounded-lg border-2 border-gray-700 p-4 sm:col-span-2">
          <p>Title</p>
          <TextInput
            value={content.title}
            onChange={(value) => onPostContentChange("title", value)}
          />
          <div className="py-4">
            {imageFile ? (
              <div className="mx-auto flex max-w-80 flex-col gap-4">
                <FilePreview file={imageFile} />
                {isLoading ? (
                  <ProgressBar progress={imageProgress} />
                ) : (
                  <Button
                    className="flex items-center justify-center gap-1"
                    onClick={() => setImageFile(null)}
                    type="secondary"
                  >
                    <TrashIcon className="h-2.5 w-2.5" />
                    <span className="text-xs">Remove</span>
                  </Button>
                )}
              </div>
            ) : (
              <FileDrop
                label="Image"
                onChange={onImageFileChange}
                eligibleFileTypes={ELIGIBLE_IMAGE_TYPES}
                maxFileSize={BLOG_POST_IMAGE_MAX_SIZE}
              />
            )}
          </div>
          <p>Body</p>
          <TextEditor
            placeholder="Start writing your post"
            value={content.body}
            onChange={(value) => onPostContentChange("body", value)}
          />
        </div>
        <div>
          <SubscriptionPlanSelector
            freeFollowerImageUrl={freeFollowerImageUrl}
            onChange={setActiveSubscriptionPlan}
            subscriptionPlans={subscriptionPlans}
            activeSubscriptionPlan={activeSubscriptionPlan}
          />
        </div>
      </div>
      <Button
        onClick={onSubmit}
        loadingText="Publishing..."
        isLoading={isLoading}
        isDisabled={!imageFile || !content.title || isLoading}
        className="mr-auto sm:max-w-56"
      >
        Publish
      </Button>
    </div>
  );
};
