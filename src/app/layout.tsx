import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'animate.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@/styles/sweetalert2-custom.css';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gestion Restaurant - Commandes & Tables',
  description: 'Système de gestion professionnel pour restaurant : commandes, cuisine, bar, tables',
  keywords: ['Restaurant', 'Gestion', 'Commandes', 'Tables'],
  authors: [{ name: 'Restaurant Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
