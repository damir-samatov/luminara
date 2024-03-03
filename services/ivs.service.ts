"use server";
import {
  ChannelType,
  CreateChannelCommand,
  ChannelLatencyMode,
  DeleteStreamKeyCommand,
  CreateStreamKeyCommand,
} from "@aws-sdk/client-ivs";
import { ivs } from "@/lib/ivs";
import { sign as jwtSign } from "jsonwebtoken";

if (!process.env.AWS_IVS_NAME || !process.env.AWS_IVS_PLAYBACK_PRIVATE_KEY)
  throw new Error("AWS_IVS_NAME and AWS_IVS_PLAYBACK_SECRET are not defined");

type CreateIvsChannelParams = {
  userId: string;
};

export const createIvsChannel = async ({ userId }: CreateIvsChannelParams) => {
  try {
    const command = new CreateChannelCommand({
      name: userId,
      latencyMode: ChannelLatencyMode.NormalLatency,
      type: ChannelType.BasicChannelType,
      authorized: true,
      tags: {
        userId,
      },
    });

    const ivsCreateChannelRes = await ivs.send(command);

    console.dir(
      {
        ivsCreateChannelRes,
      },
      { depth: 20 }
    );

    if (
      !ivsCreateChannelRes ||
      !ivsCreateChannelRes.channel ||
      !ivsCreateChannelRes.channel.arn ||
      !ivsCreateChannelRes.channel.ingestEndpoint ||
      !ivsCreateChannelRes.channel.playbackUrl ||
      !ivsCreateChannelRes.streamKey ||
      !ivsCreateChannelRes.streamKey.arn ||
      !ivsCreateChannelRes.streamKey.value
    )
      return null;

    return {
      channelArn: ivsCreateChannelRes.channel.arn,
      playbackUrl: ivsCreateChannelRes.channel.playbackUrl,
      serverUrl: ivsCreateChannelRes.channel.ingestEndpoint,
      streamKeyArn: ivsCreateChannelRes.streamKey.arn,
      streamKey: ivsCreateChannelRes.streamKey.value,
    };
  } catch (error) {
    console.error("createIvsChannel", error);
    return null;
  }
};

const deleteIvsStreamKey = async (streamKeyArn: string) => {
  try {
    const command = new DeleteStreamKeyCommand({
      arn: streamKeyArn,
    });
    return await ivs.send(command);
  } catch (error) {
    console.error("deleteIvsStreamKey", error);
    return null;
  }
};

const createIvsStreamKey = async (channelArn: string) => {
  try {
    const command = new CreateStreamKeyCommand({
      channelArn: channelArn,
    });
    const ivsCreateStreamKeyRes = await ivs.send(command);

    if (
      !ivsCreateStreamKeyRes ||
      !ivsCreateStreamKeyRes.streamKey ||
      !ivsCreateStreamKeyRes.streamKey.value ||
      !ivsCreateStreamKeyRes.streamKey.arn
    )
      return null;

    return {
      streamKeyArn: ivsCreateStreamKeyRes.streamKey.arn,
      streamKey: ivsCreateStreamKeyRes.streamKey.value,
    };
  } catch (error) {
    console.error("createIvsStreamKey", error);
    return null;
  }
};

type RefreshIvsChannelStreamKeyProps = {
  streamKeyArn: string;
  channelArn: string;
};

export const refreshIvsChannelStreamKey = async ({
  streamKeyArn,
  channelArn,
}: RefreshIvsChannelStreamKeyProps) => {
  try {
    const deleteStreamKeyRes = await deleteIvsStreamKey(streamKeyArn);

    if (!deleteStreamKeyRes) return null;

    const createStreamKeyRes = await createIvsStreamKey(channelArn);

    if (!createStreamKeyRes) return null;

    console.dir(
      {
        createStreamKeyRes,
      },
      {
        depth: 20,
      }
    );

    return createStreamKeyRes;
  } catch (error) {
    console.error("refreshIvsChannelStreamKey", error);
    return null;
  }
};

export const getIvsViewerToken = async (channelArn: string) => {
  try {
    const payload = {
      "aws:channel-arn": channelArn,
      "aws:access-control-allow-origin": "*",
      exp: Date.now() + 60_000,
    };

    return jwtSign(payload, process.env.AWS_IVS_PLAYBACK_PRIVATE_KEY!, {
      algorithm: "ES384",
    });
  } catch (error) {
    console.error("getIvsViewerToken", error);
    return null;
  }
};
