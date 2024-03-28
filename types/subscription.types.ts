import { Subscription, User } from "@prisma/client";

export type SubscriptionWithUser = Subscription & {
  user: User;
};
