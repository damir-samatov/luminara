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
import { User } from "@prisma/client";

type GlobalContext = {
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
  setSelf: () => {},
});

type GlobalContextProviderProps = {
  subscriptions: SubscriptionWithUser[];
  self: User;
  children: ReactNode;
};

export const GlobalContextProvider: FC<GlobalContextProviderProps> = ({
  self: savedSelf,
  children,
}) => {
  const [self, setSelf] = useState<User>(savedSelf);

  return (
    <GlobalContext.Provider
      value={{
        self,
        setSelf,
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
