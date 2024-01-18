"use client";
import { onUpdateSelfStreamCredentials } from "@/actions/stream.actions";
import { IngressInput } from "livekit-server-sdk";

export const StreamActions = () => {
  const generateKeys = async () => {
    await onUpdateSelfStreamCredentials(IngressInput.RTMP_INPUT);
  };

  return <button onClick={generateKeys}>Generate Keys</button>;
};

export default StreamActions;
