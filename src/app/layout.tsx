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
  title: "Factory Website CRM — Website + CRM для вашего бизнеса",
  description: "Сайт с CRM под ключ. €999 разово.",
  metadataBase: new URL("https://saas-mvp-funnel-production.up.railway.app"),
  openGraph: {
    title: "Factory Website CRM — Website + CRM для вашего бизнеса",
    description: "Сайт с CRM под ключ. €999 разово.",
    url: "/",
    type: "website",
    images: [
      {
        url: "https://saas-mvp-funnel-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Factory Website CRM — воронка создания CRM-сайта",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Factory Website CRM — Website + CRM для вашего бизнеса",
    description: "Сайт с CRM под ключ. €999 разово.",
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
        <meta property="og:title" content="Factory Website CRM — Website + CRM для вашего бизнеса" />
        <meta
          property="og:description"
          content="Сайт с CRM под ключ. €999 разово."
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
