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

const title = "caa";
const description = "Get compliant and get secure.";
const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : "https://caa.Nsustain.com/";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: title,
  description: description,
  category: "technology",
  keywords: ["compliance", "security"],
  openGraph: {
    title: title,
    description: description,
    url: url,
    siteName: title,
    type: "website",
  },
  twitter: {
    title: title,
    card: "summary_large_image",
    description: description,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"></link>
      <link rel="icon" href="/favicon.ico" type="image/x-icon"></link>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense >{children}</Suspense>
          </ThemeProvider>
      </body>
    </html>
  );
}
