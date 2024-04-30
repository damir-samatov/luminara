import { FC, useCallback, useState } from "react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { toast } from "react-toastify";
import { TextInput } from "@/components/TextInput";
import { TextEditor } from "@/components/TextEditor";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { PencilIcon } from "@heroicons/react/24/outline";
import { onUpdateProfileContent } from "@/actions/profile.actions";

type ProfileAboutProps = {
  title: string;
  body: string;
  isSelf: boolean;
  onContentChanged: (content: { title: string; body: string }) => void;
};

export const ProfileAbout: FC<ProfileAboutProps> = ({
  title: savedtitle,
  body: savedBody,
  isSelf,
  onContentChanged,
}) => {
  const [content, setContent] = useState({
    title: savedtitle,
    body: savedBody,
  });
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const res = await onUpdateProfileContent({
        title: content.title,
        body: content.body,
      });
      if (!res.success) return toast("Something went wrong", { type: "error" });
      updatePrevState(content);
      toast("Content updated successfully", { type: "success" });
      setIsModalOpen(false);
      onContentChanged(content);
    } catch (error) {
      console.error(error);
      toast("Something went wrong", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [content, updatePrevState]);

  const onDiscardClick = () => {
    setContent(prevState);
    setForceUpdate((prev) => prev + 1);
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <h3 className="text-2xl md:text-4xl">{prevState.title}</h3>
          {isSelf && (
            <Button
              className="ml-auto flex max-w-max items-center gap-2"
              onClick={() => setIsModalOpen(true)}
              type="primary"
            >
              <PencilIcon className="h-3 w-3" />
              <span>Edit</span>
            </Button>
          )}
        </div>
        <div dangerouslySetInnerHTML={{ __html: prevState.body }} />
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-6 rounded-lg border-2 border-gray-800 bg-gray-950 p-6">
            <p className="text-3xl">About Me</p>
            <div className="flex flex-col gap-2">
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
          </div>
        </Modal>
      )}
    </>
  );
};
