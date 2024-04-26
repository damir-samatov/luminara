"use client";
import { TextInput } from "@/components/TextInput";
import { TextEditor } from "@/components/TextEditor";
import { Button } from "@/components/Button";
import { FC, useState } from "react";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { onUpdateSubscriptionPlanContent } from "@/actions/subscription-plan.actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type SubscriptionPlanContentEditorProps = {
  subscriptionPlanId: string;
  initialTitle: string;
  initialDescription: string;
};

export const SubscriptionPlanContentEditor: FC<
  SubscriptionPlanContentEditorProps
> = ({ subscriptionPlanId, initialDescription, initialTitle }) => {
  const router = useRouter();
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

  const isSaveDisabled =
    isLoading || !changeDetected || content.title.length < 1;

  const onSaveClick = async () => {
    try {
      setIsLoading(true);
      const res = await onUpdateSubscriptionPlanContent({
        subscriptionPlanId: subscriptionPlanId,
        subscriptionPlanUpdateContentDto: content,
      });
      if (!res.success) return toast(res.message, { type: "error" });
      const newContent = {
        title: res.data.title,
        description: res.data.description,
      };
      setContent(newContent);
      updatePrevState(newContent);
      toast("Subscription plan content updated.", { type: "success" });
      router.refresh();
    } catch (error) {
      toast("Something went wrong.", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

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
        value={content.description}
        forceUpdate={forceUpdate}
        onChange={(value) => onChange("description", value)}
      />
      {changeDetected && (
        <div className="ml-auto grid w-full grid-cols-2 gap-2">
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
