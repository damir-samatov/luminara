"use client";
import { SensitiveText } from "@/components/SensitiveText";
import { StreamCredentialsUpdateDto } from "@/types/stream.types";
import { FC, useState } from "react";
import { Button } from "@/components/Button";
import { onRefreshSelfStreamKey } from "@/actions/stream-owner.actions";

type StreamCredentialsProps = {
  initialStreamCredentials: StreamCredentialsUpdateDto;
};

export const StreamCredentials: FC<StreamCredentialsProps> = ({
  initialStreamCredentials,
}) => {
  const [streamCredentials, setStreamCredentials] =
    useState<StreamCredentialsUpdateDto>(initialStreamCredentials);

  const [isLoading, setIsLoading] = useState(false);
  const onRefreshStreamKeyClick = async () => {
    setIsLoading(true);
    try {
      const res = await onRefreshSelfStreamKey();
      if (!res.success) return;
      setStreamCredentials((prev) => ({
        ...prev,
        streamKey: res.data.stream.streamKey,
      }));
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const { streamKey, serverUrl } = streamCredentials;

  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-lg font-semibold">Config</p>
      <SensitiveText
        value={`rtmps://${serverUrl}:443/app/`}
        label="Server URL"
      />
      <SensitiveText value={streamKey} label="Stream Key" />
      <div className="mt-auto">
        <Button
          size="max-content"
          isLoading={isLoading}
          isDisabled={isLoading}
          onClick={onRefreshStreamKeyClick}
        >
          Refresh Stream Key
        </Button>
      </div>
    </div>
  );
};
