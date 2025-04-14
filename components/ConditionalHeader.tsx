"use client";

import { usePathname } from "next/navigation";
import MainHeader from "@/components/main-header/MainHeader";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/auth");
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAuthRoute || isAdminRoute) {
    return null;
  }

  return <MainHeader />;
}
