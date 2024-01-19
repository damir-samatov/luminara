"use client";
import { SensitiveText } from "@/components/SensitiveText";
import { StreamCredentialsUpdateDto } from "@/types/stream.types";
import { FC, useState } from "react";
import { useServerAction } from "@/hooks/useServerAction";
import { onUpdateSelfStreamCredentials } from "@/actions/stream.actions";
import { Button } from "@/components/Button";
import { IngressInput } from "livekit-server-sdk";

type StreamCredentialsProps = {
  initialStreamCredentials: StreamCredentialsUpdateDto;
};

export const StreamCredentials: FC<StreamCredentialsProps> = ({
  initialStreamCredentials,
}) => {
  const [streamCredentials, setStreamCredentials] =
    useState<StreamCredentialsUpdateDto>(initialStreamCredentials);

  const [updateStreamCredentials, isLoading] = useServerAction(
    onUpdateSelfStreamCredentials,
    (res) => {
      console.log(res);
      if (!res.success) return;
      setStreamCredentials(res.data.newStreamCredentials);
    },
    console.log
  );

  return (
    <div className="flex flex-col items-start gap-4">
      <p className="py-2 text-lg font-semibold">STREAM CREDENTIALS</p>
      <div className="flex w-full gap-4">
        <SensitiveText
          value={streamCredentials.serverUrl || ""}
          label="SERVER URL"
        />
        <SensitiveText
          value={streamCredentials.streamKey || ""}
          label="STREAM KEY"
        />
      </div>
      <Button
        size="max-content"
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={() => updateStreamCredentials(IngressInput.RTMP_INPUT)}
        loadingText="GENRATING STREAM CREDENTIALS..."
      >
        GENERATE STREAM CREDENTIALS
      </Button>
    </div>
  );
};
