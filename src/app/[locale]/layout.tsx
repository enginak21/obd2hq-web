import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    },
    twitter: {
      card: "summary_large_image",
      title: "OBD2HQ - Ultimate Vehicle Diagnostic Code & Warning Light Database",
      description: "Search over 10,000 OBD2 diagnostic trouble codes and dashboard warning lights.",
    },
    icons: {
      icon: '/icon.jpg',
      apple: '/apple-icon.jpg',
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


export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate locale
  if (!['en', 'de', 'es', 'tr', 'fr'].includes(locale)) {
    notFound();
  }
  
  setRequestLocale(locale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-[#0a0f1c]">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
