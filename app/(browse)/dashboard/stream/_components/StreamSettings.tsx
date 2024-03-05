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
        label="Enable Chat"
        value={streamSettings.isChatEnabled}
        onChange={(value) => onChange("isChatEnabled", value)}
      />
      <TextInput
        className="bg-gray-800 py-2"
        value={streamSettings.title}
        onChange={(value) => onChange("title", value)}
        placeholder="Title..."
      />
      <TextEditor
        onChange={(value) => onChange("description", value)}
        initialValue={streamSettings.description}
        placeholder="Description..."
      />
      <div className="flex gap-2 sm:max-w-80">
        <Button
          isDisabled={isLoading || !changeDetected}
          isLoading={isLoading}
          loadingText="Saving..."
          onClick={onSaveClick}
        >
          Save
        </Button>
        <Button
          type="secondary"
          isDisabled={isLoading || !changeDetected}
          onClick={onDiscardSettings}
        >
          Discard
        </Button>
      </div>
    </div>
  );
};
