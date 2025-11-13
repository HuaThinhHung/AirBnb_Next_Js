"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/home/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show footer on admin or auth pages
  const shouldShowFooter =
    !pathname?.startsWith("/admin") &&
    !pathname?.startsWith("/login") &&
    !pathname?.startsWith("/register");

  if (!shouldShowFooter) return null;

  return <Footer />;
}
