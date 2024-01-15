import { headers } from "next/headers";
import { liveKitWebhookReceiver } from "@/lib/liveKitWebhookReceiver";

export const validateIngressWebhook = async (req: Request) => {
  const headerPayload = headers();
  const authHeader = headerPayload.get("Authorization");

  if (!authHeader) {
    throw new Error("Unauthorized Webhook!");
  }

  const body = await req.text();

  return liveKitWebhookReceiver.receive(body, authHeader);
};
