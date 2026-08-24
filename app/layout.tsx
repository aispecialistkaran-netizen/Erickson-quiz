import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BRAND_TOKENS } from '@/config/brand';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: BRAND_TOKENS.meta.title,
  description: BRAND_TOKENS.meta.description,
  keywords: [
    'coaching readiness assessment',
    'erickson coaching international india',
    'become a coach india',
    'icf coach training',
    'solution focused coaching',
    'professional coach education',
  ],
  openGraph: {
    title: BRAND_TOKENS.meta.title,
    description: BRAND_TOKENS.meta.description,
    url: BRAND_TOKENS.meta.canonicalUrl,
    siteName: BRAND_TOKENS.name,
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: BRAND_TOKENS.meta.canonicalUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#071E2A] text-[#F7F9FA] antialiased`}>
        {children}
      </body>
    </html>
  );
}
