"use client";
import { uploadFile } from "@/helpers/client/file.helpers";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { onCreateVideoPost } from "@/actions/video.actions";
import { PostContent } from "@/types/post.types";
import { onCreateImagePost } from "@/actions/post.actions";

export const publishVideoPost = async (
  postContent: PostContent,
  videoFile: File,
  thumbnailFile: File
) => {
  try {
    const [videoUpload, thumbnailUpload] = await Promise.all([
      uploadFile(videoFile),
      uploadFile(thumbnailFile),
    ]);

    if (!videoUpload || !thumbnailUpload)
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return await onCreateVideoPost({
      title: postContent.title,
      body: postContent.body,
      videos: [
        {
          title: videoUpload.title,
          key: videoUpload.fileKey,
          thumbnailKey: thumbnailUpload.fileKey,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const createImagePost = async (
  postContent: PostContent,
  imageFiles: File[]
) => {
  try {
    const imageUploads = await Promise.all(imageFiles.map(uploadFile));

    return await onCreateImagePost({
      title: postContent.title,
      body: postContent.body,
      images: imageUploads.filter(Boolean).map((upload) => ({
        key: upload.fileKey,
        title: upload.title,
      })),
    });
  } catch (error) {
    console.error(error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
