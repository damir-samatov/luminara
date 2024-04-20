"use server";
import {
  ActionCombinedResponse,
  ActionDataResponse,
} from "@/types/action.types";
import { SubscriptionPlan } from "@prisma/client";
import { authSelf } from "@/services/auth.service";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlanById,
  getSubscriptionPlanById,
  getSubscriptionPlansByUserId,
  updateSubscriptionPlanContent,
} from "@/services/subscription-plan.service";
import {
  SubscriptionPlanCreateDto,
  SubscriptionPlanUpdateContentDto,
} from "@/types/subscription-plan.types";
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

type OnGetSelfSubscriptionPlansResponse = ActionDataResponse<{
  subscriptionPlans: (SubscriptionPlan & {
    imageUrl: string | null;
  })[];
}>;

export const onGetSelfSubscriptionPlans =
  async (): Promise<OnGetSelfSubscriptionPlansResponse> => {
    try {
      const self = await authSelf();
      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
      const subscriptionPlans = await getSubscriptionPlansByUserId(self.id);
      if (!subscriptionPlans) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
      const subscriptionPlansWithImageUrls = await Promise.all(
        subscriptionPlans.map(async (subscriptionPlan) => {
          const imageUrl = await getSignedFileReadUrl(
            subscriptionPlan.imageKey
          );
          return {
            ...subscriptionPlan,
            imageUrl,
          };
        })
      );

      return {
        success: true,
        data: {
          subscriptionPlans: subscriptionPlansWithImageUrls,
        },
      };
    } catch (error) {
      console.error("onGetSelfSubscriptionPlans", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };

type OnGetSubscriptionPlanByIdResponse = ActionDataResponse<{
  subscriptionPlan: SubscriptionPlan & {
    imageUrl: string | null;
  };
}>;

export const onGetSubscriptionPlanById = async (
  id: string
): Promise<OnGetSubscriptionPlanByIdResponse> => {
  try {
    const [self, subscriptionPlan] = await Promise.all([
      authSelf(),
      getSubscriptionPlanById(id),
    ]);

    if (!subscriptionPlan) return ERROR_RESPONSES.NOT_FOUND;
    if (!self || subscriptionPlan.userId !== self.id)
      return ERROR_RESPONSES.UNAUTHORIZED;

    const imageUrl = await getSignedFileReadUrl(subscriptionPlan.imageKey);

    return {
      success: true,
      data: {
        subscriptionPlan: {
          ...subscriptionPlan,
          imageUrl,
        },
      },
    };
  } catch (error) {
    console.error("onGetSubscriptionPlanById", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnCreateSubscriptionPlanResponse = ActionDataResponse<{
  subscriptionPlan: SubscriptionPlan;
  imageUploadUrl: string;
}>;

export const onCreateSubscriptionPlan = async (
  subscriptionPlanCreateDto: SubscriptionPlanCreateDto
): Promise<OnCreateSubscriptionPlanResponse> => {
  try {
    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const imageKey = generateFileKey(self.id);

    const imageUploadUrl = await getSignedFileUploadUrl({
      key: imageKey,
      size: subscriptionPlanCreateDto.image.size,
      type: subscriptionPlanCreateDto.image.type,
    });

    if (!imageUploadUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const subscriptionPlan = await createSubscriptionPlan({
      userId: self.id,
      title: subscriptionPlanCreateDto.title,
      description: subscriptionPlanCreateDto.description,
      price: subscriptionPlanCreateDto.price,
      imageKey,
    });

    if (!subscriptionPlan) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/subscription-plans");

    return {
      success: true,
      data: {
        subscriptionPlan,
        imageUploadUrl,
      },
    };
  } catch (error) {
    console.error("onCreateSubscriptionPlan", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnUpdateSubscriptionPlanProps = {
  subscriptionPlanId: string;
  subscriptionPlanUpdateContentDto: SubscriptionPlanUpdateContentDto;
};

type OnUpdateSubscriptionPlanResponse = ActionDataResponse<{
  title: string;
  description: string;
}>;

export const onUpdateSubscriptionPlanContent = async ({
  subscriptionPlanId,
  subscriptionPlanUpdateContentDto,
}: OnUpdateSubscriptionPlanProps): Promise<OnUpdateSubscriptionPlanResponse> => {
  try {
    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    const subscriptionPlan = await updateSubscriptionPlanContent({
      userId: self.id,
      subscriptionPlanId,
      subscriptionPlanUpdateContentDto,
    });
    if (!subscriptionPlan) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    revalidatePath("/subscription-plans");
    return {
      success: true,
      data: {
        title: subscriptionPlan.title,
        description: subscriptionPlan.description,
      },
    };
  } catch (error) {
    console.error("onUpdateSubscriptionPlan", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

export const onDeleteSubscriptionPlanById = async (
  subscriptionPlanId: string
): Promise<ActionCombinedResponse> => {
  try {
    const [self, subscriptionPlan] = await Promise.all([
      authSelf(),
      getSubscriptionPlanById(subscriptionPlanId),
    ]);

    if (!subscriptionPlan) return ERROR_RESPONSES.NOT_FOUND;
    if (!self || subscriptionPlan.userId !== self.id)
      return ERROR_RESPONSES.UNAUTHORIZED;

    deleteFile(subscriptionPlan.imageKey);

    const res = await deleteSubscriptionPlanById(subscriptionPlanId);

    if (!res) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    revalidatePath("/subscription-plans");

    return {
      success: true,
      message: `Subscription plan - ${res.price}$, deleted successfully.`,
    };
  } catch (error) {
    console.error("onDeleteSubscriptionPlanById", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetSubscriptionPlanImageUploadUrlProps = {
  subscriptionPlanId: string;
  image: {
    size: number;
    type: string;
  };
};
type OnGetSubscriptionPlanImageUploadUrlResponse = ActionDataResponse<{
  imageUploadUrl: string;
}>;

export const onGetSubscriptionPlanImageUploadUrl = async ({
  subscriptionPlanId,
  image,
}: OnGetSubscriptionPlanImageUploadUrlProps): Promise<OnGetSubscriptionPlanImageUploadUrlResponse> => {
  try {
    if (image.size > SUBSCRIPTION_PLAN_IMAGE_MAX_SIZE)
      return ERROR_RESPONSES.BAD_REQUEST;
    if (!ELIGIBLE_IMAGE_TYPES.includes(image.type))
      return ERROR_RESPONSES.BAD_REQUEST;

    const [self, subscriptionPlan] = await Promise.all([
      authSelf(),
      getSubscriptionPlanById(subscriptionPlanId),
    ]);

    if (!subscriptionPlan) return ERROR_RESPONSES.NOT_FOUND;
    if (!self || subscriptionPlan.userId !== self.id)
      return ERROR_RESPONSES.UNAUTHORIZED;

    const imageUploadUrl = await getSignedFileUploadUrl({
      key: subscriptionPlan.imageKey,
      size: image.size,
      type: image.type,
    });

    if (!imageUploadUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        imageUploadUrl,
      },
    };
  } catch (error) {
    console.error("onGetSubscriptionImageUploadUrlById", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
