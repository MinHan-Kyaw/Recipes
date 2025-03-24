"use client";
import PageTransition from "@/components/PageTransition";
import { ReactNode } from "react";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
