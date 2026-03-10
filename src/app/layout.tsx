import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { QueryProvider } from '@/components/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toast } from '@/components/ui/Toast';
import { BadgeCelebration } from '@/components/features/dashboard/BadgeCelebration';
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
  themeColor: '#F97316',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F97316" />
      </head>
      <body className="font-sans antialiased transition-colors duration-300">
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toast />
            <BadgeCelebration />
            <PWAInit />
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
