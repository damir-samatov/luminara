"use client";
import { onGetSignedFileUploadUrl } from "@/actions/file.actions";
import axios from "axios";

type OnProgress = (progress: number) => void;

export const uploadFile = async (file: File, onProgress?: OnProgress) => {
  try {
    const res = await onGetSignedFileUploadUrl({
      title: file.name,
      type: file.type,
      size: file.size,
    });

    if (!res.success) return null;

    await axios.put(res.data.signedUrl, file, {
      onUploadProgress: (progressEvent) => {
        onProgress && onProgress(progressEvent?.progress || 0);
      },
    });

    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
