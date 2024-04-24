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
import { onGetSubscriptions } from "@/actions/subscription.actions";
import { User } from "@prisma/client";

type BrowseNavigationContext = {
  subscriptions: SubscriptionWithUser[];
  setSubscriptions: Dispatch<SetStateAction<SubscriptionWithUser[]>>;
  refresh: () => void;
  self: User;
  setSelf: Dispatch<SetStateAction<User>>;
};

const BrowseNavigationContext = createContext<BrowseNavigationContext>({
  self: {
    id: "",
    externalUserId: "",
    username: "",
    imageUrl: "",
    firstName: "",
    lastName: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  subscriptions: [],
  setSubscriptions: () => {},
  setSelf: () => {},
  refresh: () => {},
});

type BrowseNavigationContextProviderProps = {
  subscriptions: SubscriptionWithUser[];
  self: User;
  children: ReactNode;
};

export const BrowseNavigationContextProvider: FC<
  BrowseNavigationContextProviderProps
> = ({ subscriptions: savedSubscriptions, self: savedSelf, children }) => {
  const [self, setSelf] = useState<User>(savedSelf);
  const [subscriptions, setSubscriptions] =
    useState<SubscriptionWithUser[]>(savedSubscriptions);

  const refresh = async () => {
    const res = await onGetSubscriptions();
    if (!res.success) return;
    setSubscriptions(res.data.subscriptions);
  };

  return (
    <BrowseNavigationContext.Provider
      value={{
        self,
        subscriptions,
        setSubscriptions,
        setSelf,
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
