import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/shopify/CartSidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shopify Store - Premium Products & Collections",
    template: "%s | Shopify Store"
  },
  description: "Discover amazing products with seamless shopping experience. High-quality items with fast shipping and excellent customer service.",
  keywords: ["shopify", "ecommerce", "online store", "products", "shopping"],
  authors: [{ name: "Shopify Store" }],
  creator: "Shopify Store",
  publisher: "Shopify Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Shopify Store - Premium Products & Collections",
    description: "Discover amazing products with seamless shopping experience. High-quality items with fast shipping and excellent customer service.",
    siteName: "Shopify Store",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shopify Store - Premium Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Store - Premium Products & Collections",
    description: "Discover amazing products with seamless shopping experience.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
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
        <SmoothScrollProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartSidebar />
          <SpeedInsights/>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
