"use server";
import { ERROR_RESPONSES } from "@/configs/responses.config";
import { ActionDataResponse } from "@/types/action.types";
import { authSelf } from "@/services/auth.service";
import { getPostById } from "@/services/post.service";
import { getSubscriptionWithPlan } from "@/services/subscription.service";
import { createComment } from "@/services/comment.service";
import { CommentDto } from "@/types/comment.types";

type OnComment = (props: { postId: string; body: string }) => Promise<
  ActionDataResponse<{
    comment: CommentDto;
  }>
>;

export const onComment: OnComment = async ({ postId, body }) => {
  try {
    if (body.length < 1) return ERROR_RESPONSES.BAD_REQUEST;

    const [self, post] = await Promise.all([authSelf(), getPostById(postId)]);

    if (!self) return ERROR_RESPONSES.UNAUTHORIZED;
    if (!post) return ERROR_RESPONSES.NOT_FOUND;

    if (self.id !== post.userId) {
      const subscription = await getSubscriptionWithPlan(self.id, post.userId);
      if (!subscription) return ERROR_RESPONSES.NOT_SUBSCRIBED;

      if (
        post.subscriptionPlan &&
        post.subscriptionPlan.price >
          (subscription.subscriptionPlan?.price || 0)
      )
        return ERROR_RESPONSES.NOT_SUBSCRIBED;
    }

    const comment = await createComment({
      userId: self.id,
      postId,
      body,
    });

    if (!comment) return ERROR_RESPONSES.SOMETHING_WENT_WRONG;

    return {
      success: true,
      data: {
        comment,
      },
    };
  } catch (error) {
    console.error("onComment", error);
    return ERROR_RESPONSES.SOMETHING_WENT_WRONG;
  }
};
