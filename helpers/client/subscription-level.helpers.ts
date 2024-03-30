"use client";
import { uploadFile } from "@/helpers/client/file.helpers";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { SubscriptionLevelCreateDto } from "@/types/subscription-levels.types";
import { onCreateSubscriptionLevel } from "@/actions/subscription-level.actions";

export const createSubscriptionLevel = async (
  subscriptionLevelCreateDto: Omit<SubscriptionLevelCreateDto, "imageKey">,
  imageFile: File
) => {
  try {
    const imageUpload = await uploadFile(imageFile);

    if (!imageUpload) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return await onCreateSubscriptionLevel({
      ...subscriptionLevelCreateDto,
      imageKey: imageUpload.fileKey,
    });
  } catch (error) {
    console.error(error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
