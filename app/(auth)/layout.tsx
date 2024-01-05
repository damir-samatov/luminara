import { FC, ReactNode, Suspense } from "react";
import { Counter } from "@/components/Counter";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div>
      <Counter />
      <p>AUTH</p>
      <Suspense fallback="Loading...">{children}</Suspense>
    </div>
  );
};
export default AuthLayout;
