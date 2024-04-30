"use server";
import { getUserByUsername } from "@/services/user.service";
import { authSelf } from "@/services/auth.service";
import { getSubscription } from "@/services/subscription.service";
import { getBan } from "@/services/ban.service";
import { Subscription } from "@prisma/client";
import {
  ActionCombinedResponse,
  ActionDataResponse,
} from "@/types/action.types";
import { ERROR_RESPONSES, SUCCESS_RESPONSES } from "@/configs/responses.config";
import { getSubscriptionPlansByUserId } from "@/services/subscription-plan.service";
import { getStreamByUserId } from "@/services/stream.service";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import {
  getSignedFileReadUrl,
  getSignedFileUploadUrl,
} from "@/services/s3.service";
import { UserDto } from "@/types/user.types";
import {
  createProfile,
  getProfile,
  updateProfileContent,
} from "@/services/profile.service";
import { generateFileKey } from "@/helpers/server/s3.helpers";
import {
  ELIGIBLE_IMAGE_TYPES,
  PROFILE_COVER_IMAGE_MAX_SIZE,
} from "@/configs/file.config";

type OnGetProfileDataResponse = ActionDataResponse<{
  user: UserDto;
  isLive: boolean;
  subscription: Subscription | null;
  subscriptionPlans: SubscriptionPlanDto[];
  profile: {
    title: string;
    body: string;
    coverImageUrl: string;
  };
}>;

export const onGetProfileData = async (
  username: string
): Promise<OnGetProfileDataResponse> => {
  try {
    const [self, user] = await Promise.all([
      authSelf(),
      getUserByUsername(username),
    ]);

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (!user) return ERROR_RESPONSES.NOT_FOUND;

    if (self.id !== user.id) {
      const selfBan = await getBan(user.id, self.id);
      if (selfBan) return ERROR_RESPONSES.NOT_FOUND;
    }

    const [subscription, subscriptionPlans, stream] = await Promise.all([
      getSubscription(self.id, user.id),
      getSubscriptionPlansByUserId(user.id),
      getStreamByUserId(user.id),
    ]);

    if (!subscriptionPlans) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    const subscriptionPlansWithImageUrls = await Promise.all(
      subscriptionPlans.map(async (subscriptionPlan) => {
        const imageUrl = await getSignedFileReadUrl(subscriptionPlan.imageKey);
        return {
          ...subscriptionPlan,
          imageUrl,
        };
      })
    );

    const coverImageUrl = await getSignedFileReadUrl(
      user.profile?.coverImageKey || ""
    );

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
        },
        profile: {
          title: user.profile?.title || "",
          body: user.profile?.body || "",
          coverImageUrl,
        },
        isLive: stream?.isLive || false,
        subscription,
        subscriptionPlans: subscriptionPlansWithImageUrls,
      },
    };
  } catch (error) {
    console.error("onGetProfileData", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnUpdateProfileContentResponse = (props: {
  title: string;
  body: string;
}) => Promise<ActionCombinedResponse>;

export const onUpdateProfileContent: OnUpdateProfileContentResponse = async ({
  title,
  body,
}) => {
  try {
    if (title.length < 1) return ERROR_RESPONSES.BAD_REQUEST;

    const self = await authSelf();
    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

    const profile = await getProfile(self.id);

    if (!profile) {
      const coverImageKey = generateFileKey(self.id);
      const createdProfile = await createProfile({
        userId: self.id,
        coverImageKey,
      });
      if (!createdProfile) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }

    const res = await updateProfileContent({
      userId: self.id,
      title,
      body,
    });

    if (!res) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return SUCCESS_RESPONSES.SUCCESS;
  } catch (error) {
    console.error("onUpdateProfileBody", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};

type OnGetProfileCoverImageUploadUrl = (props: {
  type: string;
  size: number;
}) => Promise<
  ActionDataResponse<{
    coverImageUploadUrl: string;
  }>
>;

export const onGetProfileCoverImageUploadUrl: OnGetProfileCoverImageUploadUrl =
  async ({ type, size }) => {
    try {
      if (
        !ELIGIBLE_IMAGE_TYPES.includes(type) ||
        size > PROFILE_COVER_IMAGE_MAX_SIZE
      )
        return ERROR_RESPONSES.BAD_REQUEST;

      const self = await authSelf();
      if (!self) return ERROR_RESPONSES.UNAUTHORIZED;

      let profile = await getProfile(self.id);

      if (!profile) {
        const coverImageKey = generateFileKey(self.id);
        const createdProfile = await createProfile({
          userId: self.id,
          coverImageKey,
        });
        if (!createdProfile) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
        profile = createdProfile;
      }

      const coverImageUploadUrl = await getSignedFileUploadUrl({
        key: profile.coverImageKey,
        size,
        type,
      });

      if (!coverImageUploadUrl) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

      return {
        success: true,
        data: {
          coverImageUploadUrl,
        },
      };
    } catch (error) {
      console.error("onGetProfileCoverImageUploadUrl", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };
