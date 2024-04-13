import { SensitiveText } from "@/components/SensitiveText";
import { StreamCredentialsUpdateDto } from "@/types/stream.types";
import { FC, useState } from "react";
import { Button } from "@/components/Button";

type StreamCredentialsProps = {
  streamCredentials: StreamCredentialsUpdateDto;
  onRefreshStreamKey: () => Promise<unknown>;
};

export const StreamCredentials: FC<StreamCredentialsProps> = ({
  streamCredentials,
  onRefreshStreamKey,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { streamKey, serverUrl } = streamCredentials;

  const onRefreshStreamKeyPress = async () => {
    setIsLoading(true);
    await onRefreshStreamKey();
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-gray-700 p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SensitiveText
          value={`rtmps://${serverUrl}:443/app/`}
          label="Server URL"
        />
        <SensitiveText value={streamKey} label="Stream Key" />
      </div>
      <Button
        className="ml-auto sm:max-w-80"
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={onRefreshStreamKeyPress}
      >
        Refresh Stream Key
      </Button>
    </div>
  );
};
