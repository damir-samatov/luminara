import { FC, ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center">
      {children}
    </div>
  );
};
export default AuthLayout;
