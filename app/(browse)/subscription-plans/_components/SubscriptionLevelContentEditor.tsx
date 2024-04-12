"use client";
import { TextInput } from "@/components/TextInput";
import { TextEditor } from "@/components/TextEditor";
import { Button } from "@/components/Button";
import { FC, useState } from "react";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { onUpdateSubscriptionLevelContent } from "@/actions/subscription-level.actions";

type SubscriptionLevelContentEditorProps = {
  subscriptionLevelId: string;
  initialTitle: string;
  initialDescription: string;
};

export const SubscriptionLevelContentEditor: FC<
  SubscriptionLevelContentEditorProps
> = ({ subscriptionLevelId, initialDescription, initialTitle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [content, setContent] = useState({
    title: initialTitle,
    description: initialDescription,
  });

  const { updatePrevState, changeDetected, prevState } =
    useObjectShadow(content);

  const onChange = <T extends keyof typeof content>(
    key: T,
    value: (typeof content)[T]
  ) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const onSaveClick = async () => {
    setIsLoading(true);

    const res = await onUpdateSubscriptionLevelContent({
      subscriptionLevelId: subscriptionLevelId,
      subscriptionLevelUpdateContentDto: content,
    });

    if (res.success) {
      const newContent = {
        title: res.data.title,
        description: res.data.description,
      };
      setContent(newContent);
      updatePrevState(newContent);
    } else {
      console.error("onSaveClick");
    }

    setIsLoading(false);
  };

  const onDiscardClick = () => {
    setContent(prevState);
    setForceUpdate((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-gray-700 p-4 text-gray-300">
      <div>
        <p>Title</p>
        <TextInput
          className="h-auto rounded border-2 border-gray-700 bg-transparent p-2"
          value={content.title}
          onChange={(value) => onChange("title", value)}
        />
      </div>
      <div>
        <p>Description</p>
        <TextEditor
          placeholder="Subscription level description"
          value={content.description}
          forceUpdate={forceUpdate}
          onChange={(value) => onChange("description", value)}
        />
      </div>
      {changeDetected && (
        <div className="grid max-w-96 grid-cols-2 gap-4">
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
            isDisabled={isLoading || !changeDetected}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
