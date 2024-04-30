import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FC, ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { classNames } from "@/utils/style.utils";
import "@/public/global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My App",
  description: "My App",
};

const inter = Inter({ subsets: ["latin"] });

type BrowseLayoutProps = {
  children: ReactNode;
};

const RootLayout: FC<BrowseLayoutProps> = ({ children }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "white",
        },
        elements: {
          logoBox: "hidden",
          formButtonPrimary: "text-white bg-gray-700 hover:bg-gray-600",
          card: "bg-gray-900 rounded-md",
        },
        layout: {
          socialButtonsVariant: "blockButton",
          socialButtonsPlacement: "bottom",
          shimmer: true,
        },
      }}
    >
      <html lang="en">
        <body
          className={classNames(
            inter.className,
            "min-h-screen",
            "flex",
            "flex-col"
          )}
        >
          {children}
          <ToastContainer
            position="bottom-center"
            autoClose={2000}
            theme="dark"
            hideProgressBar
            newestOnTop
            closeOnClick
            draggable
          />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
