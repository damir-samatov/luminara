export enum ErrorResponseType {
  UNAUTHORIZED = "UNAUTHORIZED",
  SOMETHING_WENT_WRONG = "SOMETHING_WENT_WRONG",
  STREAM_EXISTS = "STREAM_EXISTS",
  NOT_FOUND = "NOT_FOUND",
  FORBIDDEN = "FORBIDDEN",
  BAD_REQUEST = "BAD_REQUEST",
}

export type ActionErrorResponse = {
  success: false;
  message: string;
  type: ErrorResponseType;
};

export type ActionSuccessResponse = {
  success: true;
  message: string;
};

export type ActionSuccessData<T> = {
  success: true;
  data: T;
};

export type ActionCombinedResponse =
  | ActionSuccessResponse
  | ActionErrorResponse;

export type ActionDataResponse<T> = ActionErrorResponse | ActionSuccessData<T>;
