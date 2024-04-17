"use server";
import {
  ActionCombinedResponse,
  ActionDataResponse,
} from "@/types/action.types";
import { SubscriptionLevel } from "@prisma/client";
import { authSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import {
  createSubscriptionLevel,
  deleteSubscriptionLevelById,
  getSubscriptionLevelById,
  getSubscriptionLevelsByUserId,
  updateSubscriptionLevelContent,
} from "@/services/subscription-levels.service";
import {
  SubscriptionLevelCreateDto,
  SubscriptionLevelUpdateContentDto,
} from "@/types/subscription-levels.types";
import {
  deleteFile,
  getSignedFileReadUrl,
  getSignedFileUploadUrl,
} from "@/services/s3.service";
import { revalidatePath } from "next/cache";
import { generateFileKey } from "@/helpers/server/s3.helpers";
import {
  ELIGIBLE_IMAGE_TYPES,
  SUBSCRIPTION_PLAN_IMAGE_MAX_SIZE,
} from "@/configs/file.config";

type OnGetSelfSubscriptionLevelsResponse = ActionDataResponse<{
  subscriptionLevels: (SubscriptionLevel & {
    imageUrl: string | null;
  })[];
}>;

export const onGetSelfSubscriptionLevels =
  async (): Promise<OnGetSelfSubscriptionLevelsResponse> => {
    try {
      const self = await authSelf();
      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
      const subscriptionLevels = await getSubscriptionLevelsByUserId(self.id);
      if (!subscriptionLevels) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
      const subscriptionLevelsWithImageUrls = await Promise.all(
        subscriptionLevels.map(async (subscriptionLevel) => {
          const imageUrl = await getSignedFileReadUrl(
            subscriptionLevel.imageKey
          );
          return {
            ...subscriptionLevel,
            imageUrl,
          };
        })
      );

      return {
        success: true,
        data: {
          subscriptionLevels: subscriptionLevelsWithImageUrls,
        },
      };
    } catch (error) {
      console.error("onGetSelfSubscriptionLevels", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };

type OnGetSubscriptionLevelByIdResponse = ActionDataResponse<{
  subscriptionLevel: SubscriptionLevel & {
    imageUrl: string | null;
  };
}>;

export const onGetSubscriptionLevelById = async (
  id: string
): Promise<OnGetSubscriptionLevelByIdResponse> => {
  try {
    const [self, subscriptionLevel] = await Promise.all([
      authSelf(),
      getSubscriptionLevelById(id),
    ]);

    if (!subscriptionLevel) return ERROR_RESPONSES.NOT_FOUND;
    if (!self || subscriptionLevel.userId !== self.id)
      return ERROR_RESPONSES.UNAUTHORIZED;

    const imageUrl = await getSignedFileReadUrl(subscriptionLevel.imageKey);

    return {
      success: true,
      data: {
        subscriptionLevel: {
          ...subscriptionLevel,
          imageUrl,
        },
      },
    };
  } catch (error) {
    console.error("onGetSubscriptionLevelById", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnCreateSubscriptionLevelResponse = ActionDataResponse<{
  subscriptionLevel: SubscriptionLevel;
  imageUploadUrl: string;
}>;

export const onCreateSubscriptionLevel = async (
  subscriptionLevelCreateDto: SubscriptionLevelCreateDto
): Promise<OnCreateSubscriptionLevelResponse> => {
  try {
    const self = await authSelf();

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const imageKey = generateFileKey(self.id);

    const { title, description, price } = subscriptionLevelCreateDto;

    const subscriptionLevel = await createSubscriptionLevel({
      userId: self.id,
      title,
      description,
      price,
      imageKey,
    });

    if (!subscriptionLevel) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const imageUploadUrl = await getSignedFileUploadUrl({
      key: subscriptionLevel.imageKey,
      size: subscriptionLevelCreateDto.image.size,
      type: subscriptionLevelCreateDto.image.type,
    });

    if (!imageUploadUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/subscription-plans");
    return {
      success: true,
      data: {
        subscriptionLevel,
        imageUploadUrl: imageUploadUrl.signedUrl,
      },
    };
  } catch (error) {
    console.error("onCreateSubscriptionLevel", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnUpdateSubscriptionLevelProps = {
  subscriptionLevelId: string;
  subscriptionLevelUpdateContentDto: SubscriptionLevelUpdateContentDto;
};

type OnUpdateSubscriptionLevelResponse = ActionDataResponse<{
  title: string;
  description: string;
}>;

export const onUpdateSubscriptionLevelContent = async ({
  subscriptionLevelId,
  subscriptionLevelUpdateContentDto,
}: OnUpdateSubscriptionLevelProps): Promise<OnUpdateSubscriptionLevelResponse> => {
  try {
    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const subscriptionLevel = await updateSubscriptionLevelContent({
      userId: self.id,
      subscriptionLevelId,
      subscriptionLevelUpdateContentDto,
    });
    if (!subscriptionLevel) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    revalidatePath("/subscription-plans");
    return {
      success: true,
      data: {
        title: subscriptionLevel.title,
        description: subscriptionLevel.description,
      },
    };
  } catch (error) {
    console.error("onUpdateSubscriptionLevel", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onDeleteSubscriptionLevelById = async (
  subscriptionLevelId: string
): Promise<ActionCombinedResponse> => {
  try {
    const [self, subscriptionLevel] = await Promise.all([
      authSelf(),
      getSubscriptionLevelById(subscriptionLevelId),
    ]);

    if (!subscriptionLevel) return ERROR_RESPONSES.NOT_FOUND;
    if (!self || subscriptionLevel.userId !== self.id)
      return ERROR_RESPONSES.UNAUTHORIZED;

    deleteFile(subscriptionLevel.imageKey);

    const res = await deleteSubscriptionLevelById(subscriptionLevelId);

    if (!res) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/subscription-plans");

    return {
      success: true,
      message: `Subscription plan - ${res.price}$, deleted successfully.`,
    };
  } catch (error) {
    console.error("onDeleteSubscriptionLevelById", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetSubscriptionLevelImageUploadUrlProps = {
  subscriptionLevelId: string;
  image: {
    size: number;
    type: string;
  };
};
type OnGetSubscriptionLevelImageUploadUrlResponse = ActionDataResponse<{
  imageUploadUrl: string;
}>;

export const onGetSubscriptionLevelImageUploadUrl = async ({
  subscriptionLevelId,
  image,
}: OnGetSubscriptionLevelImageUploadUrlProps): Promise<OnGetSubscriptionLevelImageUploadUrlResponse> => {
  try {
    if (image.size > SUBSCRIPTION_PLAN_IMAGE_MAX_SIZE)
      return ERROR_RESPONSES.BAD_REQUEST;
    if (!ELIGIBLE_IMAGE_TYPES.includes(image.type))
      return ERROR_RESPONSES.BAD_REQUEST;

    const [self, subscriptionLevel] = await Promise.all([
      authSelf(),
      getSubscriptionLevelById(subscriptionLevelId),
    ]);

    if (!subscriptionLevel) return ERROR_RESPONSES.NOT_FOUND;
    if (!self || subscriptionLevel.userId !== self.id)
      return ERROR_RESPONSES.UNAUTHORIZED;

    const imageUploadUrl = await getSignedFileUploadUrl({
      key: subscriptionLevel.imageKey,
      size: image.size,
      type: image.type,
    });

    if (!imageUploadUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        imageUploadUrl: imageUploadUrl.signedUrl,
      },
    };
  } catch (error) {
    console.error("onGetSubscriptionImageUploadUrlById", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
