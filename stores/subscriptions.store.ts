"use client";
import { create } from "zustand";
import { SubscriptionWithUser } from "@/types/subscription.types";
import { getSubscriptions } from "@/actions/subscription.actions";

type SubscriptionsStore = {
  subscriptions: SubscriptionWithUser[];
  setSubscriptions: (subscriptions: SubscriptionWithUser[]) => void;
  refresh: () => void;
};

export const useSubscriptionsStore = create<SubscriptionsStore>((set) => ({
  subscriptions: [],
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  refresh: () => {
    getSubscriptions().then((subscriptions) => {
      set({ subscriptions });
    });
  },
}));
