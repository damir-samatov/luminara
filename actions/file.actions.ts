"use server";
import { ActionDataResponse } from "@/types/action.types";
import { getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import {
  getSignedFileReadUrl,
  getSignedFileUploadUrl,
} from "@/services/s3.service";
import { ELIGIBLE_FILE_TYPES, MAX_FILE_SIZE } from "@/configs/file.config";

type GetSignedFileUploadUrlParams = {
  title: string;
  size: number;
  type: string;
};

type OnGetSignedFileUploadUrlResponse = ActionDataResponse<{
  signedUrl: string;
  fileKey: string;
  title: string;
}>;

export const onGetSignedFileUploadUrl = async ({
  title,
  size,
  type,
}: GetSignedFileUploadUrlParams): Promise<OnGetSignedFileUploadUrlResponse> => {
  try {
    const self = await getSelf();

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    if (size > MAX_FILE_SIZE || !ELIGIBLE_FILE_TYPES.includes(type))
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const fileKey = `${new Date().toISOString()}_${self.id}`;

    const signedUrl = await getSignedFileUploadUrl({
      key: fileKey,
      size: size,
      type: type,
      userId: self.id,
    });

    if (!signedUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        signedUrl,
        fileKey,
        title,
      },
    };
  } catch (error) {
    console.error("onGetSignedFileUploadUrl", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type GetSignedFileReadUrlParams = {
  key: string;
};

type OnGetSignedFileReadUrlResponse = ActionDataResponse<{
  signedUrl: string;
}>;

export const onGetSignedFileReadUrl = async ({
  key,
}: GetSignedFileReadUrlParams): Promise<OnGetSignedFileReadUrlResponse> => {
  try {
    const self = await getSelf();

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const signedUrl = await getSignedFileReadUrl(key);

    if (!signedUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        signedUrl,
      },
    };
  } catch (error) {
    console.error("onGetSignedFileReadUrl", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
