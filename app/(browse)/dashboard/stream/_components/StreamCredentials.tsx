"use client";
import { SensitiveText } from "@/components/SensitiveText";
import { StreamCredentialsUpdateDto } from "@/types/stream.types";
import { FC, useState } from "react";

type StreamCredentialsProps = {
  initialStreamCredentials: StreamCredentialsUpdateDto;
};

export const StreamCredentials: FC<StreamCredentialsProps> = ({
  initialStreamCredentials,
}) => {
  const [streamCredentials] = useState<StreamCredentialsUpdateDto>(
    initialStreamCredentials
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
    </div>
  );
};
