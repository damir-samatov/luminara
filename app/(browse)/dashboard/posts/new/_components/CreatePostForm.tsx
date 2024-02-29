"use client";
import { onGetSignedFileUploadUrl } from "@/actions/file.actions";
import { useState } from "react";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { onCreatePost } from "@/actions/post.actions";
import { ImagePicker } from "@/components/ImagePicker";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { useRouter } from "next/navigation";
import { TextEditor } from "@/components/TextEditor";

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
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const CreatePostForm = () => {
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [postContent, setPostContent] = useState<PostContent>({
    title: "",
    body: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onPostContentChange = <T extends keyof PostContent>(
    key: T,
    value: PostContent[T]
  ) => {
    setPostContent((prev) => ({ ...prev, [key]: value }));
  };

  const onCreatePostClick = async () => {
    if (!postContent.title || !postContent.body) return;
    setIsLoading(true);
    const res = await createPost(postContent, imageFiles);
    if (res.success) router.push("/dashboard/posts");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <ImagePicker files={imageFiles} onChange={setImageFiles} />
      <TextInput
        placeholder="Enter your post title"
        className="h-auto rounded-md border-2 border-gray-500 bg-transparent p-2"
        value={postContent.title}
        onChange={(value) => onPostContentChange("title", value)}
      />
      <TextEditor
        placeholder="Start writing your post"
        initialValue={postContent.body}
        onChange={(value) => onPostContentChange("body", value)}
      />
      <Button
        size="max-content"
        onClick={onCreatePostClick}
        loadingText="Creating Post..."
        isLoading={isLoading}
      >
        Create Post
      </Button>
    </div>
  );
};
