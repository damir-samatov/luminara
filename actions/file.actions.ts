"use server";
import { ActionDataResponse } from "@/types/action.types";
import { getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { getSignedFileUploadUrl } from "@/services/s3.service";

type GetSignedFileUploadUrlParams = {
  name: string;
  size: number;
  type: string;
};

type OnGetSignedFileUploadUrl = ActionDataResponse<{
  signedUrl: string;
}>;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const onGetSignedFileUploadUrl = async ({
  name,
  size,
  type,
}: GetSignedFileUploadUrlParams): Promise<OnGetSignedFileUploadUrl> => {
  try {
    const self = await getSelf();

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    if (size > MAX_FILE_SIZE) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const signedUrl = await getSignedFileUploadUrl({
      key: `${self.username}_${name}`,
      size: size,
      type: type,
    });

    if (!signedUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        signedUrl,
      },
    };
  } catch (error) {
    console.error("onGetSignedFileUploadUrl", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
