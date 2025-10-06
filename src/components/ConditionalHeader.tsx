"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Don't show header on admin or auth pages
  const shouldShowHeader =
    !pathname?.startsWith("/admin") &&
    !pathname?.startsWith("/login") &&
    !pathname?.startsWith("/register");

  if (!shouldShowHeader) return null;

  return <Header />;
}
