"use client";
import { uploadFile } from "@/helpers/client/file.helpers";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { PostContent } from "@/types/post.types";
import { onCreateImagePost } from "@/actions/post.actions";

export const createImagePost = async (
  postContent: PostContent,
  imageFiles: File[]
) => {
  try {
    const imageUploads = await Promise.all(
      imageFiles.map((file) => uploadFile(file))
    );

    return await onCreateImagePost({
      title: postContent.title,
      body: postContent.body,
      images: imageUploads.filter(Boolean).map((upload) => ({
        //TODO FIX
        key: upload.signedUrl,
        title: "image",
      })),
    });
  } catch (error) {
    console.error(error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
