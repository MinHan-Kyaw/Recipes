import ClientWrapper from "@/components/ClientWrapper";
import { ReactNode } from "react";
import "../globals.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <ClientWrapper>{children}</ClientWrapper>;
}
