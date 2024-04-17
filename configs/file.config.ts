export const ELIGIBLE_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];

export const ELIGIBLE_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const ELIGIBLE_FILE_TYPES = [
  ...ELIGIBLE_IMAGE_TYPES,
  ...ELIGIBLE_VIDEO_TYPES,
];

export const MAX_FILE_SIZE = 100 * 1024 * 1024;
export const UPLOAD_FILE_EXPIRATION_TIME = 10 * 60;
export const READ_FILE_EXPIRATION_TIME = 10 * 60;
export const SUBSCRIPTION_PLAN_IMAGE_MAX_SIZE = 1024 * 1024;
export const STREAM_THUMBNAIL_IMAGE_MAX_SIZE = 2 * 1024 * 1024;
