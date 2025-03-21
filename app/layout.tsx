import ConditionalHeader from "@/components/ConditionalHeader";
import ClientWrapper from "@/components/ClientWrapper";
import { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  
  return (
    <html lang="en">
      <body>
        <ConditionalHeader />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
