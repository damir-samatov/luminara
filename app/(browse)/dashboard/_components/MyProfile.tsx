"use client";
import { useState } from "react";
import { FileDrop } from "@/components/FileDrop";
import { Button } from "@/components/Button";
import { onGetSignedFileUploadUrl } from "@/actions/file.actions";
import { createIvsChannel } from "@/services/ivs.service";

export const MyProfile = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

  const onCreateChannelClick = async () => {
    setIsCreatingChannel(true);
    try {
      await createIvsChannel({
        key: "test-channel_" + new Date().getTime(),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingChannel(false);
    }
  };

  const onUploadClick = async () => {
    setIsUploading(true);
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
      setIsUploading(false);
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
        isLoading={isUploading}
        isDisabled={isUploading || files.length < 1}
        onClick={onUploadClick}
        loadingText="UPLOADING..."
      >
        UPLOAD
      </Button>
      <Button
        size="max-content"
        isLoading={isCreatingChannel}
        isDisabled={isCreatingChannel}
        onClick={onCreateChannelClick}
        loadingText="CREATING IVS CHANNEL..."
      >
        CREATE IVS CHANNEL
      </Button>
    </div>
  );
};
