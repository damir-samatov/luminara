"use client";
import { useState } from "react";
import { FileDrop } from "@/components/FileDrop";
import { Button } from "@/components/Button";
import { onGetSignedFileUploadUrl } from "@/actions/file.actions";

export const MyProfile = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onUploadClick = async () => {
    setIsLoading(true);
    const file = files[0];
    if (!file) return;
    try {
      const res = await onGetSignedFileUploadUrl({
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (!res.success) return onError(res.message);

      await fetch(res.data.signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      setFiles([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (message: string) => {
    console.log({ message });
  };

  return (
    <div>
      <FileDrop files={files} onChange={setFiles} />
      <Button
        size="max-content"
        isLoading={isLoading}
        isDisabled={isLoading || files.length < 1}
        onClick={onUploadClick}
        loadingText="UPLOADING..."
      >
        UPLOAD
      </Button>
    </div>
  );
};
