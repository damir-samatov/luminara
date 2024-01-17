export type ActionErrorResponse = {
  success: false;
  message: string;
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
