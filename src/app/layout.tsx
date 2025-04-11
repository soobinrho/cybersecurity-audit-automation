import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Suspense } from "react";
import Loading from "@/app/loading";

const title = process.env.NEXT_PUBLIC_TITLE || "";
const titleFull = process.env.NEXT_PUBLIC_TITLE_FULL || "";
const description = process.env.NEXT_PUBLIC_DESCRIPTION || "";
const url = process.env.NEXT_PUBLIC_URL || "";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    template: `%s - ${title}`,
    default: titleFull,
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
    title: {
      template: `%s - ${title}`,
      default: titleFull,
    },
    description: description,
    url: url,
    siteName: titleFull,
    type: "website",
  },
  twitter: {
    title: {
      template: `%s - ${title}`,
      default: titleFull,
    },
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
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
