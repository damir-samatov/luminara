"use server";
import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (!process.env.AWS_S3_BUCKET_NAME)
  throw new Error("AWS_S3_BUCKET_NAME is not defined");

type GetSignedFileUploadUrlParams = {
  key: string;
  size: number;
  type: string;
};

export async function getSignedFileUploadUrl({
  key,
  size,
  type,
}: GetSignedFileUploadUrlParams) {
  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: new Date().toISOString() + "_" + key,
      ContentType: type,
      ContentLength: size,
    });

    return await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 120,
    });
  } catch (error) {
    return null;
  }
}
