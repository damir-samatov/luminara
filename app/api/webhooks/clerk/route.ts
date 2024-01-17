import { validateClerkWebhook } from "@/helpers/clerk.helpers";
import {
  createUser,
  deleteUserByExternalUserId,
  updateUser,
} from "@/services/user.service";
import { resetIngressesByUserId } from "@/services/ingress.service";

export async function POST(req: Request) {
  try {
    const webhookEvent = await validateClerkWebhook(req);

    if (
      webhookEvent.type === "user.updated" &&
      webhookEvent.data.username &&
      webhookEvent.data.image_url
    ) {
      await updateUser({
        externalUserId: webhookEvent.data.id,
        username: webhookEvent.data.username,
        imageUrl: webhookEvent.data.image_url,
      });
    }

    if (
      webhookEvent.type === "user.created" &&
      webhookEvent.data.username &&
      webhookEvent.data.image_url
    ) {
      await createUser({
        externalUserId: webhookEvent.data.id,
        username: webhookEvent.data.username,
        imageUrl: webhookEvent.data.image_url,
      });
    }

    if (webhookEvent.type === "user.deleted" && webhookEvent.data.id) {
      const deletedUser = await deleteUserByExternalUserId(
        webhookEvent.data.id
      );
      if (deletedUser) await resetIngressesByUserId(deletedUser.id);
    }

    return Response.json(
      { message: "Webhook Processed Successfully!" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("clerkUserWebhook", error);
    return Response.json(
      { message: "Webhook Failed!", error },
      {
        status: 400,
      }
    );
  }
}
