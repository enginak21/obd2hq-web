import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "OBD2HQ - Ultimate Vehicle Diagnostic Code & Warning Light Database",
    description: "Search over 10,000 OBD2 diagnostic trouble codes and dashboard warning lights. Find symptoms, direct causes, and estimated repair costs for all car makes and models.",
    metadataBase: new URL("https://www.obd2hq.com"),
    verification: {
      google: "4G3G4_xUQnE6Ss724YJkBp9Tmc41qJmd-etzpEFS1H4",
    },
    openGraph: {
      title: "OBD2HQ - Ultimate Vehicle Diagnostic Code & Warning Light Database",
      description: "Search over 10,000 OBD2 diagnostic trouble codes and dashboard warning lights. Find symptoms, direct causes, and estimated repair costs.",
      url: `https://www.obd2hq.com/${locale}`,
      siteName: "OBD2HQ",
      locale: locale,
      type: "website",
      images: [
        {
          url: "/images/site/diagnostic-hero.webp",
          width: 1600,
          height: 900,
          alt: "OBD2HQ vehicle diagnostic dashboard and OBD2 scanner",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "OBD2HQ - Ultimate Vehicle Diagnostic Code & Warning Light Database",
      description: "Search over 10,000 OBD2 diagnostic trouble codes and dashboard warning lights.",
      images: ["/images/site/diagnostic-hero.webp"],
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/favicon.svg',
    },
    appleWebApp: {
      title: 'OBD2HQ',
      statusBarStyle: 'black-translucent',
      capable: true,
    },
  };
}

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';

const supportedLocales = ['en', 'de', 'es', 'tr', 'fr'];

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;


  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);


  const messages = await getMessages();
  const clientMessages = {
    Navbar: messages.Navbar,
    SmartSearch: messages.SmartSearch,
    Wizard: messages.Wizard,
    CommonUI: messages.CommonUI,
  };
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang={locale}
      className="h-full antialiased"
    >
      <head>
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className="min-h-[100dvh] flex flex-col bg-[#0a0f1c]"
        style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}
      >
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <Navbar />
          <div
            className="flex-1 flex flex-col"
            style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}
          >
            {children}
          </div>
        </NextIntlClientProvider>
          <Footer />
      </body>
    </html>
  );
}
