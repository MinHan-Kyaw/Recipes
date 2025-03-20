import MainHeader from "@/components/main-header/MainHeader";
import ClientWrapper from "@/components/ClientWrapper";
import { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MainHeader />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
