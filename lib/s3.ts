import { S3Client } from "@aws-sdk/client-s3";

if (
  !process.env.AWS_REGION ||
  !process.env.AWS_S3_BUCKET_USER_KEY ||
  !process.env.AWS_S3_BUCKET_USER_SECRET
)
  throw new Error(
    "AWS_REGION, AWS_S3_BUCKET_USER_KEY, AWS_S3_BUCKET_USER_SECRET are not defined!"
  );

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_BUCKET_USER_KEY,
    secretAccessKey: process.env.AWS_S3_BUCKET_USER_SECRET,
  },
});
