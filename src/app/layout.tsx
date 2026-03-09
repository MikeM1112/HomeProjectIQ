import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { QueryProvider } from '@/components/QueryProvider';
import { Toast } from '@/components/ui/Toast';
import { PWAInit } from '@/components/PWAInit';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

export const metadata: Metadata = {
  title: 'HomeProjectIQ — Know before you build',
  description:
    'HomeProjectIQ tells you in 60 seconds whether to DIY or hire a pro — with exact steps, tools, and parts.',
  openGraph: {
    title: 'HomeProjectIQ — Know before you build',
    description:
      'HomeProjectIQ tells you in 60 seconds whether to DIY or hire a pro — with exact steps, tools, and parts.',
    url: 'https://homeprojectiq.com',
    siteName: 'HomeProjectIQ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomeProjectIQ — Know before you build',
    description:
      'DIY or hire a pro? Get your answer in 60 seconds with exact steps, tools, and costs.',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#C05E14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C05E14" />
      </head>
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
          <Toast />
          <PWAInit />
        </QueryProvider>
      </body>
    </html>
  );
}
