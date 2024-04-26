"use client";
import { TextInput } from "@/components/TextInput";
import { TextEditor } from "@/components/TextEditor";
import { Button } from "@/components/Button";
import { FC, useCallback, useState } from "react";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { onUpdatePostContent } from "@/actions/post.actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type PostContentEditorProps = {
  postId: string;
  title: string;
  body: string;
};

export const PostContentEditor: FC<PostContentEditorProps> = ({
  postId,
  title,
  body,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [content, setContent] = useState({
    title,
    body,
  });

  const { updatePrevState, changeDetected, prevState } =
    useObjectShadow(content);

  const onChange = <T extends keyof typeof content>(
    key: T,
    value: (typeof content)[T]
  ) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const isSaveDisabled =
    isLoading || !changeDetected || content.title.length < 1;

  const onSaveClick = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await onUpdatePostContent({
        postId: postId,
        title: content.title,
        body: content.body,
      });
      if (!res.success) return toast("Something went wrong", { type: "error" });
      updatePrevState(content);
      toast("Content updated successfully", { type: "success" });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast("Something went wrong", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [content, postId, updatePrevState]);

  const onDiscardClick = () => {
    setContent(prevState);
    setForceUpdate((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border-2 border-gray-700 p-4 text-gray-300">
      <p>Title</p>
      <TextInput
        value={content.title}
        onChange={(value) => onChange("title", value)}
      />
      <p>Description</p>
      <TextEditor
        placeholder="Subscription plan description"
        value={content.body}
        forceUpdate={forceUpdate}
        onChange={(value) => onChange("body", value)}
      />
      {changeDetected && (
        <div className="ml-auto grid w-full max-w-96 grid-cols-2 gap-2">
          <Button
            type="secondary"
            onClick={onDiscardClick}
            isDisabled={isLoading || !changeDetected}
          >
            Discard
          </Button>
          <Button
            onClick={onSaveClick}
            loadingText="Saving..."
            isLoading={isLoading}
            isDisabled={isSaveDisabled}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
