import { FC, ReactNode } from "react";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader } from "@/components/Loader";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center">
      <ClerkLoading>
        <Loader />
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </div>
  );
};
export default AuthLayout;
