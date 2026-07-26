'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Layout, ArrowRight, Play, Globe } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function LandingPage() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

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
    <div className="min-h-screen bg-background selection:bg-primary/30 overflow-hidden">
      <header className="container mx-auto py-8 px-6 flex justify-between items-center relative z-20">
        <Logo />
        <div className="flex gap-4">
          {user ? (
            <Button variant="outline" className="rounded-full border-white/5 bg-white/5 backdrop-blur-md" asChild>
              <Link href="/dashboard">Workspace</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="rounded-full text-white/60 hover:text-white" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="rounded-full px-8 shadow-xl shadow-primary/20" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 lg:py-32 relative">
        <div className="absolute top-[-20%] left-[-10%] -z-10 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[160px]" />
        
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            <Globe className="h-3 w-3" />
            Empowering Distributed Teams
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white uppercase">
            UNIFY YOUR <br />
            <span className="text-primary italic">WORKSPACE.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            TeamSync provides high-fidelity collaboration for performance-driven teams. Secure video, interactive whiteboards, and real-time team synchronization in one unified interface.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button 
              size="lg" 
              onClick={handleQuickMeeting}
              className="h-16 px-12 rounded-2xl text-lg font-black shadow-2xl transition-all hover:scale-105 active:scale-95"
              disabled={isCreating}
            >
              {isCreating ? 'Deploying...' : 'Launch Instant Session'}
              <Play className="ml-4 h-5 w-5 fill-current" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-16 px-12 rounded-2xl text-lg font-black border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10"
              asChild
            >
              <Link href="/dashboard">
                Workspace
                <ArrowRight className="ml-4 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: Shield, title: "Enterprise Grade", desc: "Private signaling layers and end-to-end data synchronization ensure your team's objectives remain strictly confidential." },
            { icon: Zap, title: "Low-Latency Discovery", desc: "Optimized WebRTC architecture delivers crystal-clear media and sub-second latency for seamless peer discovery." },
            { icon: Layout, title: "Integrated Context", desc: "A unified interface combining high-fidelity media, visual ideation, and persistent signaling data." }
          ].map((feature, i) => (
            <Card key={i} className="glass-panel border-none rounded-3xl hover:ring-2 ring-primary/20 transition-all duration-500 group overflow-hidden">
              <CardContent className="p-10 space-y-6">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-inner">
                  <feature.icon className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight uppercase">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
