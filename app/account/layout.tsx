import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Account - Shopify Store",
    template: "%s | Account - Shopify Store"
  },
  description: "Manage your account, orders, and preferences.",
};

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Lightweight header for auth pages */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm border-b">
        <div className="flex justify-center px-4 sm:px-12">
          <div className="w-full flex justify-between items-center h-20">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">Christopher Photos</span>
            </a>
          </div>
        </div>
      </header>
      
      <main className="pt-20">{children}</main>
    </>
  );
}
