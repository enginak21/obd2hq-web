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

export const metadata: Metadata = {
  title: "OBD2HQ - Ultimate Vehicle Diagnostic Code & Warning Light Database",
  description: "Search over 10,000 OBD2 diagnostic trouble codes and dashboard warning lights. Find symptoms, direct causes, and estimated repair costs for all car makes and models.",
  openGraph: {
    title: "OBD2HQ - Ultimate Vehicle Diagnostic Code & Warning Light Database",
    description: "Search over 10,000 OBD2 diagnostic trouble codes and dashboard warning lights. Find symptoms, direct causes, and estimated repair costs.",
    url: "https://obd2hq.com",
    siteName: "OBD2HQ",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OBD2HQ - Ultimate Vehicle Diagnostic Code & Warning Light Database",
    description: "Search over 10,000 OBD2 diagnostic trouble codes and dashboard warning lights.",
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico', // In production, replace with high-res PNG
  },
  appleWebApp: {
    title: 'OBD2HQ',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }, { locale: 'es' }, { locale: 'tr' }, { locale: 'fr' }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate locale
  if (!['en', 'de', 'es', 'tr', 'fr'].includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
