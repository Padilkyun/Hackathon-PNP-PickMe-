import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GARUDA - Platform Verifikasi Berita Admin',
  description:
    'Dashboard admin untuk verifikasi berita, analisis sentimen, dan monitoring hoaks.',
  keywords: ['fact-check', 'hoaks', 'literasi digital', 'Indonesia', 'GARUDA', 'admin'],
  authors: [{ name: 'PICKME GARUDA Team' }],
  openGraph: {
    title: 'GARUDA Admin Dashboard',
    description: 'Platform verifikasi berita kolaboratif untuk admin.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-slate-900 text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
