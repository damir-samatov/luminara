import { Webhook } from "svix";

if (!process.env.CLERK_WEBHOOK_SECRET) {
  throw new Error(
    "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
  );
}

export const clerkWebhookReceiver = new Webhook(
  process.env.CLERK_WEBHOOK_SECRET
);
