'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Shield, Zap, Layout, ArrowRight, Play } from 'lucide-react';
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
        name: `Sync-${Math.random().toString(36).substring(7).toUpperCase()}`,
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
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="rounded-full text-white/60 hover:text-white" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="rounded-full px-8 shadow-[0_0_30px_rgba(var(--primary),0.3)]" asChild>
                <Link href="/signup">Start Now</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 lg:py-40 relative">
        <div className="absolute top-[-20%] left-[-10%] -z-10 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-20%] right-[-10%] -z-10 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[140px]" />
        
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping mr-1" />
            Empowering Modern Teams
          </div>
          
          <h1 className="text-7xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-white uppercase">
            UNIFY YOUR <br />
            <span className="text-primary italic">WORKSPACE.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            OmniMeet is a high-fidelity workspace for high-performing teams. Seamlessly bridge the gap between video, interactive whiteboards, and real-time data.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button 
              size="lg" 
              onClick={handleQuickMeeting}
              className="h-20 px-12 rounded-[2rem] text-xl font-black shadow-[0_20px_50px_rgba(var(--primary),0.3)] transition-all hover:scale-105 active:scale-95"
              disabled={isCreating}
            >
              {isCreating ? 'Initializing...' : 'Launch Instant Session'}
              <Play className="ml-4 h-6 w-6 fill-current" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-20 px-12 rounded-[2rem] text-xl font-black border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10"
              asChild
            >
              <Link href="/dashboard">
                View All Rooms
                <ArrowRight className="ml-4 h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mt-40">
          {[
            { icon: Shield, title: "Enterprise Security", desc: "Private signaling layers and data encryption ensure your organization's discussions remain strictly confidential." },
            { icon: Zap, title: "Low-Latency Media", desc: "Optimized WebRTC architecture delivers crystal-clear video and sub-second latency for seamless conversation." },
            { icon: Layout, title: "Integrated Workspace", desc: "A unified interface combining talk, visual ideation, and persistent data for comprehensive team execution." }
          ].map((feature, i) => (
            <Card key={i} className="glass-panel border-none rounded-[2.5rem] hover:ring-2 ring-primary/20 transition-all duration-500 group overflow-hidden">
              <CardContent className="p-12 space-y-6 relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <feature.icon className="h-32 w-32" />
                </div>
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                  <feature.icon className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium text-lg">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}