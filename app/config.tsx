'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from 'swr';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <SWRConfig
            value={{
              fetcher: async (url: string) => {
                await new Promise((resolve) => setTimeout(resolve, 3000));
                const response = await fetch(url);
                const data = await response.json();
                if (!response.ok || data?.error) {
                  throw new Error(data?.error || "Failed to fetch data");
                }
                return data;
              },
              onError: (error) => {
                const message = error instanceof Error ? error.message : 'An unknown error occurred';
                toast.error(message);
              },
            }}>
            {children}
            <Toaster position="top-right" />
          </SWRConfig>
        </SessionProvider>
      </body>
    </html>
  );
}
