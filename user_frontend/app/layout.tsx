import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import logo from "../public/MD-logo_transparent_bg.png"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Drop",
  description: "Your one-stop shop for all your needs. Fast delivery, unbeatable prices, and a wide selection of products at your fingertips.",
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
         {/* <header style={{ padding: "16px", borderBottom: "1px solid #eee" }}>
          <Image
            src={logo}
            alt="Logo"
            width={120} 
            height={40}
            priority
          />
        </header> */}
        {children}
      </body>
    </html>
  );
}
