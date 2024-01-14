import { headers } from "next/headers";
import { livekitWebhookReceiver } from "@/lib/livekitWebhookReceiver";

export const validateIngressWebhook = async (req: Request) => {
  const headerPayload = headers();
  const authHeader = headerPayload.get("Authorization");

  if (!authHeader) {
    throw new Error("Unauthorized Webhook!");
  }

  const body = await req.text();

  return livekitWebhookReceiver.receive(body, authHeader);
};
