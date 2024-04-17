"use server";
import { ActionDataResponse } from "@/types/action.types";
import { getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import {
  getSignedFileReadUrl,
  getSignedFileUploadUrl,
} from "@/services/s3.service";
import { ELIGIBLE_FILE_TYPES, MAX_FILE_SIZE } from "@/configs/file.config";
import {
  extractUserIdFromFileKey,
  generateFileKey,
} from "@/helpers/server/s3.helpers";

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

type OnGetSignedFileUploadUrlParams = {
  size: number;
  type: string;
};

type OnGetSignedFileUploadUrlResponse = ActionDataResponse<{
  key: string;
  signedUrl: string;
}>;

export const onGetSignedFileUploadUrl = async ({
  size,
  type,
}: OnGetSignedFileUploadUrlParams): Promise<OnGetSignedFileUploadUrlResponse> => {
  try {
    if (size > MAX_FILE_SIZE || !ELIGIBLE_FILE_TYPES.includes(type))
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const self = await getSelf();

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const key = generateFileKey(self.id);

    const res = await getSignedFileUploadUrl({
      key,
      size,
      type,
    });

    if (!res) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        key: res.key,
        signedUrl: res.signedUrl,
      },
    };
  } catch (error) {
    console.error("onGetSignedFileUploadUrl", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetSignedFileUpdateUrlParams = {
  key: string;
  size: number;
  type: string;
};

type OnGetSignedFileUpdateUrlResponse = ActionDataResponse<{
  key: string;
  signedUrl: string;
}>;

export const onGetSignedFileUpdateUrl = async ({
  key,
  size,
  type,
}: OnGetSignedFileUpdateUrlParams): Promise<OnGetSignedFileUpdateUrlResponse> => {
  try {
    if (size > MAX_FILE_SIZE || !ELIGIBLE_FILE_TYPES.includes(type))
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const self = await getSelf();

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const keyUserId = extractUserIdFromFileKey(key);

    if (keyUserId !== self.id) return ERROR_RESPONSES.UNAUTHORIZED;

    const res = await getSignedFileUploadUrl({
      key,
      size,
      type,
    });

    if (!res) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        key: res.key,
        signedUrl: res.signedUrl,
      },
    };
  } catch (error) {
    console.error("onGetSignedFileUpdateUrl", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
