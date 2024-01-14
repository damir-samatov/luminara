import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkWebhookReceiver } from "@/lib/clerkWebhookReceiver";

export const validateClerkWebhook = async (req: Request) => {
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new Error("Invalid webhook invocation! No svix headers!");
  }

  const body = await req.text();

  return clerkWebhookReceiver.verify(body, {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  }) as WebhookEvent;
};
