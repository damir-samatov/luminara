"use client";
import { createIngress } from "@/actions/ingress.actions";
import { IngressInput } from "livekit-server-sdk";

const StreamActions = () => {
  const generateKeys = async () => {
    const res = await createIngress(IngressInput.RTMP_INPUT);
  };

  return <button onClick={generateKeys}>Generate Keys</button>;
};

export default StreamActions;
