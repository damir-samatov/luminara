import { updateStreamByUserId } from "@/services/stream.service";
import { validateIngressWebhook } from "@/helpers/ingress.helpers";

export const POST = async (req: Request) => {
  try {
    const webhookEvent = await validateIngressWebhook(req);

    const userId = webhookEvent.ingressInfo?.roomName;

    if (userId) {
      if (webhookEvent.event === "ingress_ended")
        await updateStreamByUserId(userId, {
          isLive: false,
        });

      if (webhookEvent.event === "ingress_started")
        await updateStreamByUserId(userId, {
          isLive: true,
        });
    }

    return Response.json(
      { message: "Webhook Processed Successfully!" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("livekitIngressWebhook", error);
    return Response.json(
      { message: "Webhook Failed!", error },
      {
        status: 400,
      }
    );
  }
};
