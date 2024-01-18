"use client";
import { SubscriptionWithUser } from "@/types/subscription.types";
import {
  createContext,
  FC,
  ReactNode,
  SetStateAction,
  Dispatch,
  useState,
  useContext,
} from "react";
import { getSubscriptions } from "@/actions/subscription.actions";

type BrowseNavigationContext = {
  subscriptions: SubscriptionWithUser[];
  setSubscriptions: Dispatch<SetStateAction<SubscriptionWithUser[]>>;
  refresh: () => void;
};

const BrowseNavigationContext = createContext<BrowseNavigationContext>({
  subscriptions: [],
  setSubscriptions: () => {},
  refresh: () => {},
});

type BrowseNavigationContextProviderProps = {
  initialSubscriptions: SubscriptionWithUser[];
  children: ReactNode;
};

export const BrowseNavigationContextProvider: FC<
  BrowseNavigationContextProviderProps
> = ({ initialSubscriptions, children }) => {
  const [subscriptions, setSubscriptions] =
    useState<SubscriptionWithUser[]>(initialSubscriptions);

  const refresh = async () => {
    const res = await getSubscriptions();
    if (!res.success) return;
    setSubscriptions(res.data.subscriptions);
  };

  return (
    <BrowseNavigationContext.Provider
      value={{
        subscriptions,
        setSubscriptions,
        refresh,
      }}
    >
      {children}
    </BrowseNavigationContext.Provider>
  );
};

export const useBrowseNavigationContext = () => {
  const context = useContext(BrowseNavigationContext);

  if (!context)
    throw new Error(
      "useBrowseNavigationContext must be used within a BrowseNavigationContextProvider"
    );

  return context;
};
