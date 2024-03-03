import { IvschatClient } from "@aws-sdk/client-ivschat";

if (
  !process.env.AWS_REGION ||
  !process.env.AWS_IVS_USER_KEY ||
  !process.env.AWS_IVS_USER_SECRET
)
  throw new Error(
    "AWS_REGION, AWS_IVS_USER_KEY, AWS_IVS_USER_SECRET are not defined!"
  );

export const ivsChat = new IvschatClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_IVS_USER_KEY,
    secretAccessKey: process.env.AWS_IVS_USER_SECRET,
  },
});
