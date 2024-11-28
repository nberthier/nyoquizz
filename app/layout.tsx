import type { Metadata } from 'next';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import React from 'react';

import './globals.css';

export const metadata: Metadata = {
  description: 'Homepage',
  title: 'Nyoquizz',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex h-full min-h-screen w-full flex-col px-8 pb-8 pt-8">
          <div className="flex-none">
            <Header />
          </div>
          <main className="my-0 flex min-h-full flex-1 flex-col items-center justify-center">
            {children}
          </main>
          <div className="flex-none">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
