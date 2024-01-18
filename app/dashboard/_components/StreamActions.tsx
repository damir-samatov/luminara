"use client";
import { onGenerateStreamCredentials } from "@/actions/stream.actions";
import { IngressInput } from "livekit-server-sdk";

export const StreamActions = () => {
  const generateKeys = async () => {
    await onGenerateStreamCredentials(IngressInput.RTMP_INPUT);
  };

  return <button onClick={generateKeys}>Generate Keys</button>;
};

export default StreamActions;
