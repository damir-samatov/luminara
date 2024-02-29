"use client";
import React, { FC, useState } from "react";
import { Stream } from ".prisma/client";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { useServerAction } from "@/hooks/useServerAction";
import { onUpdateSelfStreamSettings } from "@/actions/stream.actions";
import { TextInput } from "@/components/TextInput";
import { StreamSettingsUpdateDto } from "@/types/stream.types";
import { SliderInput } from "@/components/SliderInput";
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

  const { setPrevState, changeDetected, prevState } =
    useObjectShadow(streamSettings);

  const [updateStreamSettings, isUpdatingStreamSettings] = useServerAction(
    onUpdateSelfStreamSettings,
    (res) => {
      if (!res.success) return;
      console.log(res);
      setPrevState(res.data.newStreamSettings);
      setStreamSettings(res.data.newStreamSettings);
    },
    console.log
  );

  const onSave = () => {
    updateStreamSettings(streamSettings);
  };

  const onDiscard = () => {
    setStreamSettings(prevState);
  };

  const onChange = <T extends keyof Stream>(key: T, value: Stream[T]) => {
    setStreamSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex w-full justify-between">
        <p className="py-2 text-lg font-semibold">STREAM SETTINGS</p>
        {changeDetected && (
          <div className="flex w-full max-w-[400px] gap-4">
            <Button
              isDisabled={isUpdatingStreamSettings}
              isLoading={isUpdatingStreamSettings}
              loadingText="SAVING..."
              onClick={onSave}
            >
              SAVE
            </Button>
            <Button
              type="secondary"
              isDisabled={isUpdatingStreamSettings}
              onClick={onDiscard}
            >
              DISCARD
            </Button>
          </div>
        )}
      </div>
      <div className="flex w-full justify-center gap-4">
        <TextInput
          value={streamSettings.title}
          onChange={(value) => onChange("title", value)}
          placeholder="STREAM TITLE..."
        />
        <SliderInput
          label="CHAT DELAY"
          value={streamSettings.chatDelay}
          onChange={(value) => onChange("chatDelay", value)}
          max={10}
          min={0}
          step={0.5}
          unit="MINS"
        />
      </div>
      <div className="flex w-full justify-center gap-4">
        <ToggleInput
          label="ENABLE CHAT"
          value={streamSettings.isChatEnabled}
          onChange={(value) => onChange("isChatEnabled", value)}
        />

        <ToggleInput
          label="ALLOW TO CHAT FOR SUBSCRIBERS ONLY"
          value={streamSettings.isChatForSubscribersOnly}
          onChange={(value) => onChange("isChatForSubscribersOnly", value)}
        />
      </div>
    </div>
  );
};
