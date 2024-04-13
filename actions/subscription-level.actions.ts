"use server";
import {
  ActionCombinedResponse,
  ActionDataResponse,
} from "@/types/action.types";
import { SubscriptionLevel } from "@prisma/client";
import { getSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import {
  createSubscriptionLevel,
  deleteSubscriptionLevelById,
  getSubscriptionLevelById,
  getSubscriptionLevelsByUserId,
  updateSubscriptionLevelContent,
  updateSubscriptionLevelImageKey,
} from "@/services/subscription-levels.service";
import {
  SubscriptionLevelCreateDto,
  SubscriptionLevelUpdateContentDto,
} from "@/types/subscription-levels.types";
import { deleteFile, getSignedFileReadUrl } from "@/services/s3.service";
import { revalidatePath } from "next/cache";

type OnGetSelfSubscriptionLevelsResponse = ActionDataResponse<{
  subscriptionLevels: (SubscriptionLevel & {
    imageUrl: string | null;
  })[];
}>;

export const onGetSelfSubscriptionLevels =
  async (): Promise<OnGetSelfSubscriptionLevelsResponse> => {
    try {
      const self = await getSelf();
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
      getSelf(),
      getSubscriptionLevelById(id),
    ]);

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    if (!subscriptionLevel) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    if (subscriptionLevel.userId !== self.id)
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
}>;

export const onCreateSubscriptionLevel = async (
  subscriptionLevelCreateDto: SubscriptionLevelCreateDto
): Promise<OnCreateSubscriptionLevelResponse> => {
  try {
    const self = await getSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const subscriptionLevel = await createSubscriptionLevel({
      subscriptionLevelCreateDto,
      userId: self.id,
    });
    if (!subscriptionLevel) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    revalidatePath("/subscription-plans");
    return {
      success: true,
      data: {
        subscriptionLevel,
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
    const self = await getSelf();
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

type OnUpdateSubscriptionLevelImageKeyProps = {
  subscriptionLevelId: string;
  imageKey: string;
};

export const onUpdateSubscriptionLevelImageKey = async ({
  subscriptionLevelId,
  imageKey,
}: OnUpdateSubscriptionLevelImageKeyProps): Promise<ActionCombinedResponse> => {
  try {
    const [self, subscriptionLevel] = await Promise.all([
      getSelf(),
      getSubscriptionLevelById(subscriptionLevelId),
    ]);

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    if (!subscriptionLevel) return ERROR_RESPONSES.NOT_FOUND;

    if (subscriptionLevel.userId !== self.id)
      return ERROR_RESPONSES.UNAUTHORIZED;

    deleteFile(subscriptionLevel.imageKey);

    const updatedSubscriptionLevel = await updateSubscriptionLevelImageKey({
      userId: self.id,
      subscriptionLevelId,
      imageKey,
    });

    if (!updatedSubscriptionLevel) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/subscription-plans");
    return {
      success: true,
      message: "Cover image updated successfully.",
    };
  } catch (error) {
    console.error("onUpdateSubscriptionLevelImageKey", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onDeleteSubscriptionLevelById = async (
  subscriptionLevelId: string
): Promise<ActionCombinedResponse> => {
  try {
    const [self, subscriptionLevel] = await Promise.all([
      getSelf(),
      getSubscriptionLevelById(subscriptionLevelId),
    ]);

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    if (!subscriptionLevel) return ERROR_RESPONSES.NOT_FOUND;

    if (subscriptionLevel.userId !== self.id)
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
