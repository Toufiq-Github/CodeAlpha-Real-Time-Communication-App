
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from '@/components/ui/tooltip';
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Connect Social',
  description: 'Connect with friends and share your world.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`} suppressHydrationWarning>
        <FirebaseProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster />
          <FirebaseErrorListener />
        </FirebaseProvider>
      </body>
    </html>
  );
}
