"use server";
import {
  ChannelType,
  CreateChannelCommand,
  ChannelLatencyMode,
} from "@aws-sdk/client-ivs";
import { ivs } from "@/lib/ivs";
import jwt from "jsonwebtoken";

if (!process.env.AWS_IVS_NAME || !process.env.AWS_IVS_PLAYBACK_PRIVATE_KEY)
  throw new Error("AWS_IVS_NAME and AWS_IVS_PLAYBACK_SECRET are not defined");

type CreateIvsChannelParams = {
  key: string;
};
export async function createIvsChannel({ key }: CreateIvsChannelParams) {
  try {
    const command = new CreateChannelCommand({
      name: key,
      latencyMode: ChannelLatencyMode.NormalLatency,
      type: ChannelType.BasicChannelType,
      authorized: true,
    });
    const response = await ivs.send(command);

    console.dir({ response }, { depth: 30 });
    return response;
  } catch (error) {
    console.error("Error creating IVS channel", error);
    return null;
  }
}

export const getIvsViewerToken = async (channelArn: string) => {
  "use server";
  try {
    const payload = {
      "aws:channel-arn": channelArn,
      "aws:access-control-allow-origin": "*",
      exp: Date.now() + 60_000,
    };

    const token = jwt.sign(payload, process.env.AWS_IVS_PLAYBACK_PRIVATE_KEY!, {
      algorithm: "ES384",
    });
    return token;
  } catch (error) {
    console.error("getIvsViewerToken:", error);
    return null;
  }
};
