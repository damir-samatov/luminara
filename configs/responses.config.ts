import {
  ActionErrorResponse,
  ActionSuccessResponse,
  ErrorResponseType,
} from "@/types/action.types";

export const ERROR_RESPONSES = {
  [ErrorResponseType.FORBIDDEN]: {
    success: false,
    message: "Forbidden resource",
    type: ErrorResponseType.FORBIDDEN,
  },
  [ErrorResponseType.NOT_SUBSCRIBED]: {
    success: false,
    message: "Not subscribed",
    type: ErrorResponseType.NOT_SUBSCRIBED,
  },
  [ErrorResponseType.SELF_SUBSCRIPTION]: {
    success: false,
    message: "Self subscription",
    type: ErrorResponseType.SELF_SUBSCRIPTION,
  },
  [ErrorResponseType.BAD_REQUEST]: {
    success: false,
    message: "Bad request",
    type: ErrorResponseType.BAD_REQUEST,
  },
  [ErrorResponseType.UNAUTHORIZED]: {
    success: false,
    message: "Unauthorized",
    type: ErrorResponseType.UNAUTHORIZED,
  },
  [ErrorResponseType.SOMETHING_WENT_WRONG]: {
    success: false,
    message: "Something went wrong",
    type: ErrorResponseType.SOMETHING_WENT_WRONG,
  },
  [ErrorResponseType.STREAM_EXISTS]: {
    success: false,
    message: "Stream exists",
    type: ErrorResponseType.STREAM_EXISTS,
  },
  [ErrorResponseType.NOT_FOUND]: {
    success: false,
    message: "Not found",
    type: ErrorResponseType.NOT_FOUND,
  },
} satisfies Record<ErrorResponseType, ActionErrorResponse>;

export const SUCCESS_RESPONSES = {
  SUCCESS: {
    success: true,
    message: "Success",
  },
} satisfies Record<string, ActionSuccessResponse>;
