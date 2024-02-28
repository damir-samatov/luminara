"use client";
import { onGetSignedFileUploadUrl } from "@/actions/file.actions";
import { useState } from "react";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { onCreatePost } from "@/actions/post.actions";
import { ImagePicker } from "@/components/ImagePicker";

type PostContent = {
  title: string;
  body: string;
};

const uploadFile = async (file: File) => {
  const res = await onGetSignedFileUploadUrl({
    title: file.name,
    type: file.type,
    size: file.size,
  });

  if (!res.success) return null;

  await fetch(res.data.signedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return res.data;
};

const createPost = async (postContent: PostContent, imageFiles: File[]) => {
  try {
    const imageUploads = await Promise.all(imageFiles.map(uploadFile));

    return await onCreatePost({
      title: postContent.title,
      body: postContent.body,
      images: imageUploads.filter(Boolean).map((upload) => ({
        key: upload.fileKey,
        title: upload.title,
      })),
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const CreatePostForm = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [postContent, setPostContent] = useState<PostContent>({
    title: "",
    body: "",
  });

  const onPostContentChange = <T extends keyof PostContent>(
    key: T,
    value: PostContent[T]
  ) => {
    setPostContent((prev) => ({ ...prev, [key]: value }));
  };

  const onCreatePostClick = async () => {
    await createPost(postContent, imageFiles);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <TextInput
          placeholder="Title"
          value={postContent.title}
          onChange={(value) => onPostContentChange("title", value)}
        />
        <TextInput
          placeholder="Body"
          value={postContent.body}
          onChange={(value) => onPostContentChange("body", value)}
        />
      </div>
      <div className="flex flex-col gap-4">
        <ImagePicker files={imageFiles} onChange={setImageFiles} />
        <Button
          size="max-content"
          onClick={onCreatePostClick}
          loadingText="Creating Post..."
        >
          Create Post
        </Button>
      </div>
    </div>
  );
};
