"use client";
import { useState } from "react";
import { Button } from "@/components/Button";
import { createIvsChannel } from "@/services/ivs.service";

export const MyProfile = () => {
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

  const onCreateChannelClick = async () => {
    setIsCreatingChannel(true);
    try {
      await createIvsChannel({
        key: "test-channel_" + new Date().getTime(),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingChannel(false);
    }
  };

  return (
    <div>
      <Button
        size="max-content"
        isLoading={isCreatingChannel}
        isDisabled={isCreatingChannel}
        onClick={onCreateChannelClick}
        loadingText="CREATING IVS CHANNEL..."
      >
        CREATE IVS CHANNEL
      </Button>
    </div>
  );
};
