import {
  ActionErrorResponse,
  ActionSuccessResponse,
} from "@/types/action.types";
export const ERROR_RESPONSES = {
  UNAUTHORIZED: {
    success: false,
    message: "Unauthorized",
  },
  SOMETHING_WENT_WRONG: {
    success: false,
    message: "Something went wrong",
  },
  NOT_FOUND: {
    success: false,
    message: "Not found",
  },
} satisfies Record<string, ActionErrorResponse>;

export const SUCCESS_RESPONSES = {
  SUCCESS: {
    success: true,
    message: "Success",
  },
} satisfies Record<string, ActionSuccessResponse>;
