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
  [ErrorResponseType.BAD_REQUEST]: {
    success: false,
    message: "Bad request",
    type: ErrorResponseType.BAD_REQUEST,
  },
  [ErrorResponseType.UNAUTHORIZED]: {
    success: false,
    message: "Client is unauthorized",
    type: ErrorResponseType.UNAUTHORIZED,
  },
  [ErrorResponseType.SOMETHING_WENT_WRONG]: {
    success: false,
    message: "Something went wrong",
    type: ErrorResponseType.SOMETHING_WENT_WRONG,
  },
  [ErrorResponseType.STREAM_EXISTS]: {
    success: false,
    message: "Client already has a stream",
    type: ErrorResponseType.STREAM_EXISTS,
  },
  [ErrorResponseType.NOT_FOUND]: {
    success: false,
    message: "Resource not found",
    type: ErrorResponseType.NOT_FOUND,
  },
} satisfies Record<ErrorResponseType, ActionErrorResponse>;

export const SUCCESS_RESPONSES = {
  SUCCESS: {
    success: true,
    message: "Success",
  },
} satisfies Record<string, ActionSuccessResponse>;
