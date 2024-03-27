"use client";
import { useState } from "react";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { ImagePicker } from "@/components/ImagePicker";
import { useRouter } from "next/navigation";
import { TextEditor } from "@/components/TextEditor";
import { VideoPicker } from "@/components/VideoPicker";
import { publishVideoPost } from "@/helpers/client/post.helpers";
import { PostContent } from "@/types/post.types";

export const CreateVideoPostForm = () => {
  const router = useRouter();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

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

  const onCreateVideoPostClick = async () => {
    if (!postContent.title || !postContent.body) return;
    setIsLoading(true);
    if (!videoFile || !thumbnailFile) return;
    const res = await publishVideoPost(postContent, videoFile, thumbnailFile);
    if (res.success) router.push("/dashboard/videos");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        <ImagePicker
          vertical
          files={thumbnailFile ? [thumbnailFile] : []}
          onChange={(files) => {
            if (files[0]) return setThumbnailFile(files[0]);
            setThumbnailFile(null);
          }}
        />
        <VideoPicker
          vertical
          files={videoFile ? [videoFile] : []}
          onChange={(files) => {
            if (files[0]) return setVideoFile(files[0]);
            setVideoFile(null);
          }}
        />
      </div>
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
        onClick={onCreateVideoPostClick}
        loadingText="Creating Post..."
        isLoading={isLoading}
      >
        Create Video Post
      </Button>
    </div>
  );
};
