"use client";
import React, { FC, useState } from "react";
import { Stream } from ".prisma/client";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import {
  onUpdateSelfStreamSettings,
  onGoLive,
  onGoOffline,
} from "@/actions/stream-owner.actions";
import { TextInput } from "@/components/TextInput";
import { StreamSettingsUpdateDto } from "@/types/stream.types";
import { ToggleInput } from "@/components/ToggleInput";
import { Button } from "@/components/Button";

type StreamConfiguratorProps = {
  initialStreamSettings: StreamSettingsUpdateDto;
  initialIsLive: boolean;
};

export const StreamSettings: FC<StreamConfiguratorProps> = ({
  initialStreamSettings,
  initialIsLive,
}) => {
  const [streamSettings, setStreamSettings] = useState<StreamSettingsUpdateDto>(
    initialStreamSettings
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(initialIsLive);

  const { setPrevState, changeDetected, prevState } =
    useObjectShadow(streamSettings);

  const onDiscard = () => {
    setStreamSettings(prevState);
  };

  const onGoLiveClick = async () => {
    setIsLoading(true);
    try {
      const res = await onGoLive();
      if (!res.success) return;
      setIsLive(true);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const onGoOfflineClick = async () => {
    setIsLoading(true);
    try {
      const res = await onGoOffline();
      if (!res.success) return;
      setIsLive(false);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
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
      const { title, isChatEnabled } = res.data.stream;
      setPrevState({
        title,
        isChatEnabled,
      });
      setStreamSettings({
        title,
        isChatEnabled,
      });
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-start gap-4">
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
      <div className="mt-auto flex w-full gap-2">
        <Button
          size="max-content"
          isDisabled={isLoading || !changeDetected}
          isLoading={isLoading}
          loadingText="Saving..."
          onClick={onSave}
        >
          Save
        </Button>
        <Button
          size="max-content"
          type="secondary"
          isDisabled={isLoading || !changeDetected}
          onClick={onDiscard}
        >
          Discard
        </Button>
        <Button
          size="max-content"
          isLoading={isLoading}
          isDisabled={isLoading}
          onClick={isLive ? onGoOfflineClick : onGoLiveClick}
        >
          {isLive ? "Go Offline" : "Go Live"}
        </Button>
      </div>
    </div>
  );
};
