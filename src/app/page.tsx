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
    <div className="min-h-screen bg-slate-950 selection:bg-primary/30 overflow-x-hidden">
      <header className="container mx-auto py-6 md:py-8 px-4 md:px-6 flex justify-between items-center relative z-50">
        <Logo />
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-4">
          {user ? (
            <Button variant="outline" className="rounded-full border-white/5 bg-white/5 backdrop-blur-md text-white hover:bg-white/10" asChild>
              <Link href="/dashboard">Workspace</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="rounded-full text-white/60 hover:text-white" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="rounded-full px-8 shadow-xl shadow-primary/20 text-white font-bold" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden rounded-full text-white" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-4 mx-4 p-6 glass-panel rounded-3xl md:hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
            <div className="flex flex-col gap-4">
              {user ? (
                <Button className="w-full rounded-2xl h-12 font-bold" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/dashboard">Go to Workspace</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full rounded-2xl h-12 border-white/10 text-white" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button className="w-full rounded-2xl h-12 font-bold" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12 md:py-20 lg:py-32 relative">
        <div className="absolute top-[-20%] left-[-10%] -z-10 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-primary/5 rounded-full blur-[100px] md:blur-[160px]" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
          <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
            <Globe className="h-3 w-3" />
            Empowering Distributed Teams
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] text-white uppercase">
            UNIFY YOUR <br />
            <span className="text-primary italic">WORKSPACE.</span>
          </h1>
          
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium px-2">
            TeamSync provides high-fidelity collaboration for performance-driven teams. Secure video, interactive whiteboards, and real-time team synchronization in one unified interface.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center pt-4 md:pt-8">
            <Button 
              size="lg" 
              onClick={handleQuickMeeting}
              className="h-14 md:h-16 px-8 md:px-12 rounded-2xl text-base md:text-lg font-black shadow-2xl transition-all hover:scale-105 active:scale-95 text-white"
              disabled={isCreating}
            >
              {isCreating ? 'Deploying...' : 'Launch Instant Session'}
              <Play className="ml-3 md:ml-4 h-4 w-4 md:h-5 md:w-5 fill-current" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 md:h-16 px-8 md:px-12 rounded-2xl text-base md:text-lg font-black border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white"
              asChild
            >
              <Link href="/dashboard">
                Workspace
                <ArrowRight className="ml-3 md:ml-4 h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-20 md:mt-32">
          {[
            { icon: Shield, title: "Enterprise Grade", desc: "Private signaling layers and end-to-end data synchronization ensure your team's objectives remain strictly confidential." },
            { icon: Zap, title: "Low-Latency Discovery", desc: "Optimized WebRTC architecture delivers crystal-clear media and sub-second latency for seamless peer discovery." },
            { icon: Layout, title: "Integrated Context", desc: "A unified interface combining high-fidelity media, visual ideation, and persistent signaling data." }
          ].map((feature, i) => (
            <Card key={i} className={cn(
              "glass-panel border-none rounded-2xl md:rounded-3xl hover:ring-2 ring-primary/20 transition-all duration-500 group overflow-hidden",
              i === 2 && "sm:col-span-2 lg:col-span-1"
            )}>
              <CardContent className="p-8 md:p-10 space-y-4 md:space-y-6">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-inner">
                  <feature.icon className="h-6 w-6 md:h-7 md:w-7 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-white tracking-tight uppercase">{feature.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <footer className="container mx-auto px-4 md:px-6 py-8 md:py-12 border-t border-white/5 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo className="opacity-50" />
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 italic">© 2024 TeamSync Infrastructure</p>
        </div>
      </footer>
    </div>
  );
}