"use client";
import React, { FC, useState } from "react";
import { Stream } from ".prisma/client";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { useServerAction } from "@/hooks/useServerAction";
import { onUpdateSelfStreamSettings } from "@/actions/stream.actions";
import { TextInput } from "@/components/TextInput";
import { StreamSettingsUpdateDto } from "@/types/stream.types";

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
      <TextInput
        value={streamSettings.title}
        onChange={(value) => onChange("title", value)}
        label="Title"
        placeholder="Title..."
      />
      <div>
        Chat:
        <input
          className="text-black"
          type="checkbox"
          checked={streamSettings.isChatEnabled}
          onChange={(e) => onChange("isChatEnabled", e.target.checked)}
        />
      </div>
      <div>
        Subscriber Only Chat:
        <input
          type="checkbox"
          checked={streamSettings.isChatForSubscribersOnly}
          onChange={(e) =>
            onChange("isChatForSubscribersOnly", e.target.checked)
          }
        />
      </div>
      <div>
        Chat Delay:
        <input
          className="text-black"
          type="number"
          value={streamSettings.chatDelay}
          onChange={(e) => onChange("chatDelay", +e.target.value)}
        />
      </div>
      {changeDetected && (
        <div>
          <button disabled={isUpdatingStreamSettings} onClick={onSave}>
            Save
          </button>
          <button disabled={isUpdatingStreamSettings} onClick={onDiscard}>
            Discard
          </button>
        </div>
      )}
    </div>
  );
};
