import { FC, ReactNode } from "react";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader } from "@/components/Loader";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-center">
      <ClerkLoading>
        <Loader />
      </ClerkLoading>
      <ClerkLoaded>
        <div className="font-bolder flex items-end gap-2 fill-gray-400 p-8 text-3xl leading-none text-gray-400">
          <svg
            className="h-8 w-8"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
          >
            <g>
              <path
                d="M50,99.9925c0,-41.415 33.5925,-74.9925 75,-74.9925c38.835,0 70.77,29.5175 74.61,67.335c0.195,2.5375 0.39,5.0775 0.39,7.665c0,55.225 -44.775,100 -100,100c-55.225,0 -100,-44.775 -100,-100c0,-55.225 44.775,-100 100,-100c15.8525,0 30.7925,3.7925 44.115,10.36c-6.1675,-1.3125 -12.555,-2.0275 -19.115,-2.0275c-50.61425,0 -91.662,41.0345 -91.6675,91.65v0.0175c0.004,36.814 29.8525,66.6575 66.6675,66.6575c36.815,0 66.6535,-29.8435 66.6675,-66.6575v-0.0175c-0.0155,-27.6005 -22.38325,-49.9825 -50,-49.9825c-27.6125,0 -50,22.395 -50,50c0,18.415 14.925,33.33 33.3325,33.33c18.4075,0 33.3325,-14.9175 33.3325,-33.3325c0,-9.2125 -7.46,-16.6675 -16.665,-16.6675c-9.205,0 -16.6675,7.455 -16.6675,16.6675h16.6675c0,9.2125 -7.4625,16.6675 -16.6675,16.6675c-9.205,0 -16.6675,-7.455 -16.6675,-16.6675c0,-18.3975 14.9275,-33.3325 33.335,-33.3325c18.415,0 33.3325,14.935 33.3325,33.3275c-0.0075,27.6125 -22.3875,50 -50,50c-27.6125,0 -50,-22.3875 -50,-50z"
                fillRule="evenodd"
              ></path>
            </g>
          </svg>
          <span>luminara</span>
        </div>
        {children}
      </ClerkLoaded>
    </div>
  );
};
export default AuthLayout;
