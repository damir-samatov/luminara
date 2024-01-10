import { validateClerkWebhook } from "@/lib/utils/clerk.utils";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const webhookEvent = await validateClerkWebhook(req);

    if (
      webhookEvent.type === "user.updated" &&
      webhookEvent.data.username &&
      webhookEvent.data.image_url
    ) {
      const asd = await db.user.update({
        where: {
          externalUserId: webhookEvent.data.id,
        },
        data: {
          username: webhookEvent.data.username,
          imageUrl: webhookEvent.data.image_url,
        },
      });
    }

    if (
      webhookEvent.type === "user.created" &&
      webhookEvent.data.username &&
      webhookEvent.data.image_url
    ) {
      const asd = await db.user.create({
        data: {
          externalUserId: webhookEvent.data.id,
          username: webhookEvent.data.username,
          imageUrl: webhookEvent.data.image_url,
        },
      });
    }

    if (webhookEvent.type === "user.deleted" && webhookEvent.data.id) {
      const asd = await db.user.delete({
        where: {
          externalUserId: webhookEvent.data.id,
        },
      });
    }

    console.dir(webhookEvent);
    return Response.json(
      { msg: "Webhook Processed Successfully!" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { msg: "Webhook Processed Successfully!", error },
      {
        status: 400,
      }
    );
  }
}
