import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Navigation } from "@/components/Navigation";
import "@/public/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My App",
  description: "My App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          formButtonPrimary: "text-white bg-gray-700 hover:bg-gray-600",
        },
        layout: {
          socialButtonsVariant: "blockButton",
          socialButtonsPlacement: "bottom",
          shimmer: true,
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <Navigation>{children}</Navigation>
        </body>
      </html>
    </ClerkProvider>
  );
}
