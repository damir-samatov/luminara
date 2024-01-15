import { IngressClient } from "livekit-server-sdk";

if (!process.env.LIVEKIT_API_URL) {
  throw new Error("Please add LIVEKIT_API_URL from LiveKit Dashboard to .env");
}

export const liveKitIngressClient = new IngressClient(
  process.env.LIVEKIT_API_URL!
);
