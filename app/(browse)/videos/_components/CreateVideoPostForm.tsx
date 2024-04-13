"use client";
import { useState } from "react";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { ImagePicker } from "@/components/ImagePicker";
import { useRouter } from "next/navigation";
import { TextEditor } from "@/components/TextEditor";
import { VideoPicker } from "@/components/VideoPicker";
import { publishVideoPost } from "@/helpers/client/post.helpers";

export const CreateVideoPostForm = () => {
  const router = useRouter();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [postContent, setPostContent] = useState({
    title: "",
    body: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onPostContentChange = <T extends keyof typeof postContent>(
    key: T,
    value: (typeof postContent)[T]
  ) => {
    setPostContent((prev) => ({ ...prev, [key]: value }));
  };

  const onCreateVideoPostClick = async () => {
    if (!postContent.title || !postContent.body) return;
    setIsLoading(true);
    if (!videoFile || !thumbnailFile) return;
    const res = await publishVideoPost(postContent, videoFile, thumbnailFile);
    if (res.success) router.push("/videos");
    setIsLoading(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        <ImagePicker
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
        value={postContent.title}
        onChange={(value) => onPostContentChange("title", value)}
      />
      <TextEditor
        value={postContent.body}
        onChange={(value) => onPostContentChange("body", value)}
      />
      <Button
        onClick={onCreateVideoPostClick}
        loadingText="Creating Post..."
        isLoading={isLoading}
      >
        Create Video Post
      </Button>
    </div>
  );
};
