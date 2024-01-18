"use client";
import React, { FC, useState } from "react";
import { Stream } from ".prisma/client";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { useServerAction } from "@/hooks/useServerAction";
import { onUpdateSelfStream } from "@/actions/stream.actions";
import { mapStreamToUpdateDto } from "@/helpers/stream.helpers";

type StreamConfiguratorProps = {
  initialStream: Stream;
};

export const StreamConfigurator: FC<StreamConfiguratorProps> = ({
  initialStream,
}) => {
  const [stream, setStream] = useState(mapStreamToUpdateDto(initialStream));

  const { setPrevState, changeDetected, prevState } = useObjectShadow(stream);

  const [updateStream, isUpdatingStream] = useServerAction(
    onUpdateSelfStream,
    (res) => {
      if (res.success) {
        const newStreamDto = mapStreamToUpdateDto(res.data.newStream);
        setPrevState(newStreamDto);
        setStream(newStreamDto);
      }
    },
    console.log
  );

  const onSave = () => {
    updateStream(stream);
  };

  const onChange = <T extends keyof Stream>(key: T, value: Stream[T]) => {
    setStream((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <div>
        Title:
        <input
          className="text-black"
          value={stream.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      <div>
        Chat:
        <input
          className="text-black"
          type="checkbox"
          checked={stream.isChatEnabled}
          onChange={(e) => onChange("isChatEnabled", e.target.checked)}
        />
      </div>
      <div>
        Subscriber Only Chat:
        <input
          type="checkbox"
          checked={stream.isChatForSubscribersOnly}
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
          value={stream.chatDelay}
          onChange={(e) => onChange("chatDelay", +e.target.value)}
        />
      </div>
      {changeDetected && (
        <button disabled={isUpdatingStream} onClick={onSave}>
          Save
        </button>
      )}
    </div>
  );
};
