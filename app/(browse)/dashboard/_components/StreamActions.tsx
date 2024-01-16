"use client";
import { onGenerateStreamCredentials } from "@/actions/ingress.actions";
import { IngressInput } from "livekit-server-sdk";

const StreamActions = () => {
  const generateKeys = async () => {
    await onGenerateStreamCredentials(IngressInput.RTMP_INPUT);
  };

  return <button onClick={generateKeys}>Generate Keys</button>;
};

export default StreamActions;
