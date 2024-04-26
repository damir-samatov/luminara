"use server";
import { ActionCombinedResponse } from "@/types/action.types";
import { authSelf } from "@/services/auth.service";
import {
  getPostById,
  updatePostContent,
  updatePostSubscriptionPlan,
} from "@/services/post.service";
import { ERROR_RESPONSES, SUCCESS_RESPONSES } from "@/configs/responses.config";
import { getSubscriptionPlanById } from "@/services/subscription-plan.service";

type OnUpdatePostSubscriptionPlan = (props: {
  postId: string;
  subscriptionPlanId: string | null;
}) => Promise<ActionCombinedResponse>;

export const onUpdatePostSubscriptionPlan: OnUpdatePostSubscriptionPlan =
  async ({ postId, subscriptionPlanId }) => {
    try {
      const [self, post] = await Promise.all([authSelf(), getPostById(postId)]);
      if (!post) return ERROR_RESPONSES.NOT_FOUND;
      if (!self || post.userId !== self.id) return ERROR_RESPONSES.UNAUTHORIZED;

      if (subscriptionPlanId !== null) {
        const subscriptionPlan =
          await getSubscriptionPlanById(subscriptionPlanId);
        if (!subscriptionPlan) return ERROR_RESPONSES.NOT_FOUND;
        if (subscriptionPlan.userId !== self.id)
          return ERROR_RESPONSES.UNAUTHORIZED;
      }

      const res = updatePostSubscriptionPlan({
        postId,
        subscriptionPlanId,
      });

      if (!res) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

      return SUCCESS_RESPONSES.SUCCESS;
    } catch (error) {
      console.error("onUpdatePostSubscriptionPlan", error);
      return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
    }
  };

type OnUpdatePostContent = (props: {
  postId: string;
  title: string;
  body: string;
}) => Promise<ActionCombinedResponse>;

export const onUpdatePostContent: OnUpdatePostContent = async ({
  postId,
  title,
  body,
}) => {
  try {
    const [self, post] = await Promise.all([authSelf(), getPostById(postId)]);
    if (!post) return ERROR_RESPONSES.NOT_FOUND;
    if (!self || post.userId !== self.id) return ERROR_RESPONSES.UNAUTHORIZED;

    const res = updatePostContent({
      postId,
      title,
      body,
    });

    if (!res) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return SUCCESS_RESPONSES.SUCCESS;
  } catch (error) {
    console.error("onUpdatePostContent", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
