import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";

if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
  throw new Error(
    "Please add LIVEKIT_API_URL and LIVEKIT_API_KEY from LiveKit Dashboard to .env"
  );
}

const livekitWebhookReceiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export const validateIngressWebhook = async (req: Request) => {
  const headerPayload = headers();
  const authHeader = headerPayload.get("Authorization");

  if (!authHeader) {
    throw new Error("Unauthorized Webhook!");
  }

  const body = await req.text();

  return livekitWebhookReceiver.receive(body, authHeader);
};
