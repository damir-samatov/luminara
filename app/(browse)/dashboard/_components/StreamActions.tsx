"use client";
import { createIngress } from "@/actions/ingress.actions";
import { IngressInput } from "livekit-server-sdk";

const StreamActions = () => {
  const generateKeys = async () => {
    const res = await createIngress(IngressInput.RTMP_INPUT);
    console.log(res);
  };

  return (
    <div>
      <button onClick={generateKeys} className="btn btn-primary">
        Generate Keys
      </button>
    </div>
  );
};

export default StreamActions;
