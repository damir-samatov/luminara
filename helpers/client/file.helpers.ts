"use client";
import axios from "axios";

type OnProgress = (progress: number) => void;

type UploadFileToS3Params = {
  file: File;
  url: string;
  onProgress?: OnProgress;
};

export const uploadFileToS3 = async ({
  file,
  url,
  onProgress,
}: UploadFileToS3Params) => {
  try {
    await axios.put(url, file, {
      onUploadProgress: (progressEvent) => {
        onProgress && onProgress(progressEvent?.progress || 0);
      },
    });
    return file;
  } catch (error) {
    console.error(error);
    return null;
  }
};
