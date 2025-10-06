import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Đảm bảo đường dẫn này đúng
import FlowbiteInit from "@/components/FlowbiteInit";
import SmartFloatingActions from "@/components/common/SmartFloatingActions";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dự Án Airbnb",
  description: "A simple Airbnb clone built with Next.js",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalHeader />
        {children}
        <ConditionalFooter />
        <FlowbiteInit />
        <SmartFloatingActions />
      </body>
    </html>
  );
}
