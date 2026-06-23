import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { TerminalProvider } from '@/contexts/TerminalContext';
import Terminal from '@/components/terminal/Terminal';
import KeyboardShortcutsHandler from '@/components/layout/KeyboardShortcutsHandler';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Vrajkumar Shah — Cybersecurity Portfolio',
    default: 'Vrajkumar Shah — Cybersecurity & Open Source Portfolio',
  },
  description:
    'Computer Engineering undergraduate exploring cybersecurity, cloud security, AI security, and open source. Building a strong foundation through engineering projects, research, and contributions.',
  keywords: [
    'cybersecurity',
    'open source',
    'computer engineering',
    'AI security',
    'cloud security',
    'DevSecOps',
    'security research',
    'portfolio',
  ],
  authors: [{ name: 'Vrajkumar Shah' }],
  openGraph: {
    type: 'website',
    title: 'Vrajkumar Shah — Cybersecurity & Open Source Portfolio',
    description:
      'Computer Engineering undergraduate exploring cybersecurity, cloud security, AI security, and open source.',
    siteName: 'Vrajkumar Shah Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vrajkumar Shah — Cybersecurity Portfolio',
    description:
      'Computer Engineering undergraduate exploring cybersecurity, cloud security, AI security, and open source.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-hub-bg text-hub-text overflow-x-hidden">
        <TerminalProvider>
          <KeyboardShortcutsHandler />
          {children}
          <Terminal />
        </TerminalProvider>
        <Analytics />
      </body>
    </html>
  );
}
