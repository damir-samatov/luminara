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

type GlobalContext = {
  subscriptions: SubscriptionWithUser[];
  setSubscriptions: Dispatch<SetStateAction<SubscriptionWithUser[]>>;
  refresh: () => void;
  self: User;
  setSelf: Dispatch<SetStateAction<User>>;
};

const GlobalContext = createContext<GlobalContext>({
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

type GlobalContextProviderProps = {
  subscriptions: SubscriptionWithUser[];
  self: User;
  children: ReactNode;
};

export const GlobalContextProvider: FC<GlobalContextProviderProps> = ({
  subscriptions: savedSubscriptions,
  self: savedSelf,
  children,
}) => {
  const [self, setSelf] = useState<User>(savedSelf);
  const [subscriptions, setSubscriptions] =
    useState<SubscriptionWithUser[]>(savedSubscriptions);

  const refresh = async () => {
    const res = await onGetSubscriptions();
    if (!res.success) return;
    setSubscriptions(res.data.subscriptions);
  };

  return (
    <GlobalContext.Provider
      value={{
        self,
        subscriptions,
        setSubscriptions,
        setSelf,
        refresh,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context)
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );

  return context;
};
