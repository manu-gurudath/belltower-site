import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';

import './globals.css';

const brand = localFont({ src: './SchibstedGrotesk.ttf', variable: '--brand', weight: '100 900' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--mono' });

export const metadata: Metadata = {
  title: 'Belltower',
  description: 'Dining, classes, parking and the rest of UC Riverside, in one app.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${brand.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
