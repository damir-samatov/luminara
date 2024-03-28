"use client";
import { useState } from "react";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { ImagePicker } from "@/components/ImagePicker";
import { useRouter } from "next/navigation";
import { TextEditor } from "@/components/TextEditor";
import { PostContent } from "@/types/post.types";
import { createImagePost } from "@/helpers/client/post.helpers";

export const CreateImagePostForm = () => {
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
    const res = await createImagePost(postContent, imageFiles);
    if (res.success) router.push("/posts");
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
        value={postContent.body}
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
