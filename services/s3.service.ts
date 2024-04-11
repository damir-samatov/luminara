"use server";
import { s3 } from "@/lib/s3";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  READ_FILE_EXPIRATION_TIME,
  UPLOAD_FILE_EXPIRATION_TIME,
} from "@/configs/file.config";

if (!process.env.AWS_S3_BUCKET_NAME)
  throw new Error("AWS_S3_BUCKET_NAME is not defined");

type GetSignedFileUploadUrlParams = {
  key: string;
  size: number;
  type: string;
  userId: string;
};

//TODO add ChecksumSHA256 for object integrity

export const deleteFile = async (key: string) => {
  try {
    if (key.length < 1) return null;
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    return await s3.send(deleteObjectCommand);
  } catch (error) {
    return null;
  }
};

export const getSignedFileUploadUrl = async ({
  userId,
  key,
  size,
  type,
}: GetSignedFileUploadUrlParams) => {
  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: type,
      ContentLength: size,
      Metadata: {
        userId,
      },
    });

    return await getSignedUrl(s3, putObjectCommand, {
      expiresIn: UPLOAD_FILE_EXPIRATION_TIME,
    });
  } catch (error) {
    return null;
  }
};

export const getSignedFileReadUrl = async (key: string) => {
  try {
    if (key.length < 1) return null;
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3, getObjectCommand, {
      expiresIn: READ_FILE_EXPIRATION_TIME,
    });
  } catch (error) {
    return null;
  }
};
