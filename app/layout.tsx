import ConditionalHeader from "@/components/ConditionalHeader";
import ClientWrapper from "@/components/ClientWrapper";
import { AuthProvider } from "@/components/AuthProvider";
import { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ConditionalHeader />
          <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
