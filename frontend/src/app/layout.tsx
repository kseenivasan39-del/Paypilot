import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import RootClientLayout from "@/components/RootClientLayout";

export const metadata: Metadata = {
  title: "PayPilot - AI Freelance & PayPal Payments",
  description: "AI-powered freelance marketplace and PayPal secured payments",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}
