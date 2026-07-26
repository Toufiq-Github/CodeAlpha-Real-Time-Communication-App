import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from '@/components/ui/tooltip';
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'] 
});

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
      <body className={`${plusJakarta.variable} font-body antialiased bg-background text-foreground`} suppressHydrationWarning>
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
