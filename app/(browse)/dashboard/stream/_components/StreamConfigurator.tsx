"use client";
import React, { FC, useState } from "react";
import { Stream } from ".prisma/client";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { onUpdateSelfStreamSettings } from "@/actions/stream.actions";
import { TextInput } from "@/components/TextInput";
import { StreamSettingsUpdateDto } from "@/types/stream.types";
import { ToggleInput } from "@/components/ToggleInput";
import { Button } from "@/components/Button";

type StreamConfiguratorProps = {
  initialStreamSettings: StreamSettingsUpdateDto;
};

export const StreamSettings: FC<StreamConfiguratorProps> = ({
  initialStreamSettings,
}) => {
  const [streamSettings, setStreamSettings] = useState<StreamSettingsUpdateDto>(
    initialStreamSettings
  );
  const [isLoading, setIsLoading] = useState(false);

  const { setPrevState, changeDetected, prevState } =
    useObjectShadow(streamSettings);

  const onDiscard = () => {
    setStreamSettings(prevState);
  };

  const onChange = <T extends keyof Stream>(key: T, value: Stream[T]) => {
    setStreamSettings((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = async () => {
    if (isLoading || !changeDetected) return;
    setIsLoading(true);
    try {
      const res = await onUpdateSelfStreamSettings(streamSettings);
      if (!res.success) return;
      const { title, isChatEnabled, isLive } = res.data.stream;
      setPrevState({
        title,
        isChatEnabled,
        isLive,
      });
      setStreamSettings({
        title,
        isChatEnabled,
        isLive,
      });
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-start gap-6">
      <p className="text-lg font-semibold">Settings</p>
      <TextInput
        className="bg-gray-800 py-2"
        value={streamSettings.title}
        onChange={(value) => onChange("title", value)}
        placeholder="Title..."
      />
      <ToggleInput
        label="Enable Chat"
        value={streamSettings.isChatEnabled}
        onChange={(value) => onChange("isChatEnabled", value)}
      />
      <ToggleInput
        label="Go Live"
        value={streamSettings.isLive}
        onChange={(value) => onChange("isLive", value)}
      />
      <div className="mt-auto flex w-full max-w-[400px] gap-4">
        <Button
          isDisabled={isLoading || !changeDetected}
          isLoading={isLoading}
          loadingText="Saving..."
          onClick={onSave}
        >
          Save
        </Button>
        <Button
          type="secondary"
          isDisabled={isLoading || !changeDetected}
          onClick={onDiscard}
        >
          Discard
        </Button>
      </div>
    </div>
  );
};
