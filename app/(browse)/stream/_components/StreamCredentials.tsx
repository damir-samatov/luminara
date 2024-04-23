import { SensitiveText } from "@/components/SensitiveText";
import { FC, useState } from "react";
import { Button } from "@/components/Button";
import { onRefreshStreamKey } from "@/actions/stream-owner.actions";
import { toast } from "react-toastify";

type StreamCredentialsProps = {
  streamKey: string;
  streamUrl: string;
};

export const StreamCredentials: FC<StreamCredentialsProps> = ({
  streamKey: savedStreamKey,
  streamUrl,
}) => {
  const [streamKey, setStreamKey] = useState(savedStreamKey);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await onRefreshStreamKey();
      if (!res.success) return toast(res.message, { type: "error" });
      setStreamKey(res.data.streamKey);
      toast("Stream key refreshed successfully", { type: "success" });
    } catch (error) {
      toast("Something went wrong, try again", { type: "success" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-gray-700 p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SensitiveText
          value={`rtmps://${streamUrl}:443/app/`}
          label="Server URL"
        />
        <SensitiveText value={streamKey} label="Stream Key" />
      </div>
      <Button
        className="ml-auto sm:max-w-80"
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={onSubmit}
      >
        Refresh Stream Key
      </Button>
    </div>
  );
};
