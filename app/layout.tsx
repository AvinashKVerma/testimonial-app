import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ThemeProvider } from "@/app/components/theme-provider";
import Navbar from "@/app/components/navbar";
import { SessionProvider } from "@/app/components/session-provider";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Course Testimonials",
  description: "Share your experience with our courses",
  generator: "Avinash",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        {/* <ThemeProvider attribute="class" defaultTheme="light"> */}
        <div className="flex flex-col min-h-screen">
          <SessionProvider>
            <Providers>
              <Navbar />
              <div className="flex-1">{children}</div>
              <footer className="py-6 border-t text-muted-foreground text-sm text-center">
                © {new Date().getFullYear()} Course Testimonials. All rights
                reserved.
              </footer>
            </Providers>
          </SessionProvider>
        </div>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
