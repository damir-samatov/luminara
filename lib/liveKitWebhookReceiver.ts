import { WebhookReceiver } from "livekit-server-sdk";

if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
  throw new Error(
    "Please add LIVEKIT_API_KEY and LIVEKIT_API_SECRET from LiveKit Dashboard to .env"
  );
}

export const liveKitWebhookReceiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);
