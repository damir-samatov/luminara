import { FC, useState } from "react";
import { TextInput } from "@/components/TextInput";
import { StreamSettingsUpdateDto } from "@/types/stream.types";
import { ToggleInput } from "@/components/ToggleInput";
import { Button } from "@/components/Button";
import { TextEditor } from "@/components/TextEditor";

type StreamSettingsProps = {
  streamSettings: StreamSettingsUpdateDto;
  onChange: <T extends keyof StreamSettingsUpdateDto>(
    key: T,
    value: StreamSettingsUpdateDto[T]
  ) => void;
  onSaveSettings: () => Promise<unknown>;
  onDiscardSettings: () => void;
  changeDetected: boolean;
};

export const StreamSettings: FC<StreamSettingsProps> = ({
  streamSettings,
  onChange,
  onSaveSettings,
  onDiscardSettings,
  changeDetected,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSaveClick = async () => {
    setIsLoading(true);
    await onSaveSettings();
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-gray-700 p-4">
      <ToggleInput
        isDisabled={isLoading}
        label="Enable Chat"
        value={streamSettings.isChatEnabled}
        onChange={(value) => onChange("isChatEnabled", value)}
      />
      <p>Title</p>
      <TextInput
        isDisabled={isLoading}
        value={streamSettings.title}
        onChange={(value) => onChange("title", value)}
        placeholder="Title..."
      />
      <p>Description</p>
      <TextEditor
        isDisabled={isLoading}
        onChange={(value) => onChange("description", value)}
        value={streamSettings.description}
        placeholder="Description..."
      />
      {changeDetected && (
        <div className="ml-auto flex w-full gap-2 sm:max-w-96">
          <Button
            type="secondary"
            isDisabled={isLoading}
            onClick={onDiscardSettings}
          >
            Discard
          </Button>
          <Button
            isDisabled={isLoading}
            isLoading={isLoading}
            loadingText="Saving..."
            onClick={onSaveClick}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
