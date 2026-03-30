import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BfcacheGuard from "@/components/BfcacheGuard";
import SplashScreenLoader from "@/components/SplashScreenLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Old Architecture — Arhitectură & Design",
  description: "Portofoliu de arhitectură și design — Old Architecture, Republica Moldova",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Runs before React — marks <html> black for first-visit until SplashScreen takes over */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.setAttribute('data-splash','1')` }} />
        <SplashScreenLoader />
        <BfcacheGuard />
        {children}
      </body>
    </html>
  );
}
