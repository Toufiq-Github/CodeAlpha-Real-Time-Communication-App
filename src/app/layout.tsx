import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from '@/components/ui/tooltip';
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'TeamSync | Professional Collaboration Platform',
  description: 'Unify your workspace with high-fidelity video conferencing, interactive whiteboards, and real-time team synchronization.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} font-body antialiased bg-slate-950 text-slate-50`} suppressHydrationWarning>
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
