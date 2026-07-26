'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Layout, ArrowRight, Play, Globe, Menu, X } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleQuickMeeting = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsCreating(true);
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        name: `SYNC-${Math.random().toString(36).substring(7).toUpperCase()}`,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        isActive: true,
      });
      router.push(`/room/${docRef.id}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-white/10 overflow-x-hidden text-slate-50">
      <header className="container mx-auto py-8 px-6 flex justify-between items-center relative z-50">
        <Logo />
        
        <div className="hidden md:flex gap-4">
          {user ? (
            <Button variant="outline" className="rounded-full border-border bg-card/50 backdrop-blur-md text-white hover:bg-white/5 transition-all px-6" asChild>
              <Link href="/dashboard">Workspace</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-white transition-all px-6" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="rounded-full px-8 bg-white text-black font-semibold transition-all hover:bg-[#E8E8E8] active:scale-95" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden rounded-full text-white transition-all" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-4 mx-4 p-8 bg-[#181818] border border-border rounded-3xl md:hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
            <div className="flex flex-col gap-4">
              {user ? (
                <Button className="w-full rounded-2xl h-14 font-semibold uppercase tracking-widest text-xs bg-white text-black" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/dashboard">Go to Workspace</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full rounded-2xl h-14 border-border text-white bg-white/5" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button className="w-full rounded-2xl h-14 font-semibold uppercase tracking-widest text-xs bg-white text-black" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-6 py-20 lg:py-32 relative">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-border text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.3em]">
            <Globe className="h-4 w-4" />
            Empowering Distributed Teams
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-white uppercase">
            UNIFY YOUR <br />
            <span className="opacity-80">WORKSPACE.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            TeamSync provides high-fidelity collaboration for performance-driven teams. Secure video, real-time messaging, and enterprise-grade infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button 
              size="lg" 
              onClick={handleQuickMeeting}
              className="h-16 px-12 rounded-2xl text-lg font-semibold bg-white text-black transition-all hover:bg-[#E8E8E8] active:scale-95 shadow-2xl"
              disabled={isCreating}
            >
              {isCreating ? 'Deploying...' : 'Launch Instant Session'}
              <Play className="ml-4 h-5 w-5 fill-current" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-16 px-12 rounded-2xl text-lg font-semibold border-border bg-card/30 backdrop-blur-md hover:bg-white/5 text-white transition-all"
              asChild
            >
              <Link href="/dashboard">
                Workspace
                <ArrowRight className="ml-4 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-32">
          {[
            { icon: Shield, title: "Enterprise Grade", desc: "Private signaling layers and end-to-end data synchronization ensure your team's objectives remain confidential." },
            { icon: Zap, title: "Low-Latency Discovery", desc: "Optimized WebRTC architecture delivers crystal-clear media and sub-second latency for seamless peer discovery." },
            { icon: Layout, title: "Integrated Context", desc: "A unified interface combining high-fidelity media, visual ideation, and persistent signaling data." }
          ].map((feature, i) => (
            <Card key={i} className="bg-[#181818] border border-border rounded-3xl hover:border-muted-foreground/30 transition-all duration-300 group overflow-hidden">
              <CardContent className="p-10 space-y-6">
                <div className="h-14 w-14 rounded-xl bg-white/5 border border-border flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <feature.icon className="h-7 w-7 text-white group-hover:text-black transition-all" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight uppercase">{feature.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <footer className="container mx-auto px-6 py-12 border-t border-border mt-32">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Logo className="opacity-50" />
          <div className="flex gap-10 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-white transition-all">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-all">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-all">Security</Link>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">© 2024 TeamSync Infrastructure</p>
        </div>
      </footer>
    </div>
  );
}
