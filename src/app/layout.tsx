import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
  title: "MVP Factory — Website + CRM за 3 минуты",
  description: "Website + CRM для вашего бизнеса. €99 разово, навсегда, без подписки.",
  metadataBase: new URL("https://saas-mvp-funnel-production.up.railway.app"),
  openGraph: {
    title: "MVP Factory — Website + CRM за 3 минуты",
    description: "Website + CRM для вашего бизнеса. €99 разово, навсегда, без подписки.",
    url: "/",
    type: "website",
    images: [
      {
        url: "https://saas-mvp-funnel-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "MVP Factory — воронка создания CRM-сайта",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MVP Factory — Website + CRM за 3 минуты",
    description: "Website + CRM для вашего бизнеса. €99 разово, навсегда, без подписки.",
    images: ["https://saas-mvp-funnel-production.up.railway.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <meta property="og:title" content="MVP Factory — Website + CRM за 3 минуты" />
        <meta
          property="og:description"
          content="Website + CRM для вашего бизнеса. €99 разово, навсегда, без подписки."
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
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
