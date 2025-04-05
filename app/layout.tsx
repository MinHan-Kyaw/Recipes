import ConditionalHeader from "@/components/ConditionalHeader";
import ClientWrapper from "@/components/ClientWrapper";
import { AuthProvider } from "@/components/AuthProvider";
import { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ConditionalHeader />
          <ClientWrapper>{children}</ClientWrapper>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
