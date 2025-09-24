import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Providers from '@/components/providers/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "PayeTonKawa - Boutique en ligne",
  description: "Votre boutique en ligne de confiance pour tous vos besoins",
  keywords: ["e-commerce", "boutique", "en ligne", "PayeTonKawa"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
