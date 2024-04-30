"use client";
import { FC, useCallback, useState } from "react";
import { Button } from "@/components/Button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Modal } from "@/components/Modal";
import { FilePreview } from "@/components/FilePreview";
import { ProgressBar } from "@/components/ProgressBar";
import { FileDrop } from "@/components/FileDrop";
import {
  ELIGIBLE_IMAGE_TYPES,
  PROFILE_COVER_IMAGE_MAX_SIZE,
} from "@/configs/file.config";
import { toast } from "react-toastify";
import { uploadFileToS3 } from "@/helpers/client/file.helpers";
import { onGetProfileCoverImageUploadUrl } from "@/actions/profile.actions";

type ProfileBannerProps = {
  coverImageUrl: string;
  fallbackImageUrl: string;
  username: string;
  isSelf: boolean;
};

export const ProfileBanner: FC<ProfileBannerProps> = ({
  coverImageUrl,
  fallbackImageUrl,
  username,
  isSelf,
}) => {
  const [imageUrl, setImageUrl] = useState<string>(coverImageUrl);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      if (!file || isLoading) return;
      setIsLoading(true);
      const res = await onGetProfileCoverImageUploadUrl({
        type: file.type,
        size: file.size,
      });
      if (!res.success) return toast(res.message, { type: "error" });
      const uploadRes = await uploadFileToS3({
        url: res.data.coverImageUploadUrl,
        file,
        onProgress: setProgress,
      });
      if (!uploadRes)
        return toast("Failed to upload the image", {
          type: "error",
        });
      setFile(null);
      toast("Image uploaded successfully", { type: "success" });
      setImageUrl(URL.createObjectURL(file));
      setIsModalOpen(false);
    } catch (error) {
      toast("Something went wrong", { type: "error" });
      console.error(error);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  }, [file, isLoading]);

  const onFileChange = (files: File[]) => {
    const file = files[0] || null;
    setFile(file);
  };

  return (
    <>
      <div className="relative aspect-[3/1] w-full md:aspect-[8/1]">
        <img
          width={1920}
          height={1080}
          src={imageUrl || fallbackImageUrl}
          alt={username}
          className="aspect-[5/1] w-full object-cover"
          onError={(e) => {
            e.currentTarget.setAttribute("src", fallbackImageUrl);
          }}
        />
        {isSelf && (
          <div className="absolute bottom-2 right-2">
            <Button
              className="flex max-w-max items-center gap-2"
              onClick={() => setIsModalOpen(true)}
              type="primary"
            >
              <PencilIcon className="h-3 w-3" />
              <span>Edit</span>
            </Button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-6 rounded-lg border-2 border-gray-800 bg-gray-950 p-6">
            <p className="text-3xl">Cover Image</p>
            <div className="flex min-h-80">
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
                <div className="flex-grow">
                  <FileDrop
                    label="Image"
                    onChange={onFileChange}
                    eligibleFileTypes={ELIGIBLE_IMAGE_TYPES}
                    maxFileSize={PROFILE_COVER_IMAGE_MAX_SIZE}
                  />
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
