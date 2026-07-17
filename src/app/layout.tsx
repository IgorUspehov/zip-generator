import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { LandingNavigationFix } from "@/components/landing-navigation-fix";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n/context";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM Demo — за 3 минуты",
  description: "CRM Demo для вашего бизнеса. €99 — разовый платёж, без подписки.",
  metadataBase: new URL("https://saas-mvp-funnel-production.up.railway.app"),
  openGraph: {
    title: "CRM Demo — за 3 минуты",
    description: "CRM Demo для вашего бизнеса. €99 — разовый платёж, без подписки.",
    url: "/",
    type: "website",
    images: [
      {
        url: "https://saas-mvp-funnel-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "CRM Demo — воронка создания CRM-сайта",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CRM Demo — за 3 минуты",
    description: "CRM Demo для вашего бизнеса. €99 — разовый платёж, без подписки.",
    images: ["https://saas-mvp-funnel-production.up.railway.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="light" suppressHydrationWarning>
      <head>
        <meta property="og:title" content="CRM Demo — за 3 минуты" />
        <meta
          property="og:description"
          content="CRM Demo для вашего бизнеса. €99 — разовый платёж, без подписки."
        />
        <meta
          property="og:image"
          content="https://saas-mvp-funnel-production.up.railway.app/og-image.png"
        />
        <meta property="og:url" content="https://saas-mvp-funnel-production.up.railway.app/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://saas-mvp-funnel-production.up.railway.app/og-image.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-svh bg-background font-sans text-foreground antialiased`}
      >
        <I18nProvider>
          <LandingNavigationFix />
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
