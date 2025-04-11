import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = process.env.NEXT_PUBLIC_TITLE || "";
const description = process.env.NEXT_PUBLIC_DESCRIPTION || "";
const url = process.env.NEXT_PUBLIC_URL || "";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    template: `%s - ${title}`,
    default: title,
  },
  description: description,
  category: "technology",
  keywords: [
    "CyberGRC",
    "Compliance",
    "Regulation",
    "Cybersecurity",
    "Supabase",
  ],
  authors: [
    {
      name: "Soobin Rho",
      url: "https://github.com/soobinrho",
    },
  ],
  creator: "Soobin Rho",
  openGraph: {
    title: title,
    description: description,
    url: url,
    siteName: title,
    type: "website",
  },
  twitter: {
    title: title,
    description: description,
    card: "summary",
    creator: "Soobin Rho",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
